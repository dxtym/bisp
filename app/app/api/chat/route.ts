import { z } from "zod";
import {
  tool,
  streamText,
  stepCountIs,
  generateText,
  convertToModelMessages,
} from "ai";
import type { UIMessage } from "ai";
import { createHash } from "crypto";
import { userRepository } from "@/lib/repository/user";
import { ok, fail } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";
import { detectDbType, createDbClient, createSystemRepository } from "@/lib/db/factory";
import type { Schema, BlobFile } from "@/lib/repository/common";
import * as duckdbClient from "@/lib/sqlite/client";
import {
  AGENT_PROMPT,
  TOOL_DESCRIPTIONS,
} from "@/app/api/chat/const";
import anthropicClient from "@/lib/agents/anthropic/client";
import openaiClient from "@/lib/agents/openai/client";
import ollamaClient from "@/lib/agents/ollama/client";
import { index, validate } from "@/lib/rag/schema";

async function translator(prompt: string): Promise<string> {
  const { text } = await generateText({
    model: openaiClient.model,
    system: "Translate the given Uzbek text to English. Output only the translation.",
    prompt,
  });
  return text;
}

async function generator(question: string, schema: Schema[], namespace: string): Promise<string | null> {
  await index(schema, namespace);
  const ok = await validate(question, namespace);
  if (!ok) return null;

  const metadata = schema.map((t) => `${t.table}: ${t.columns.map((c) => `${c.name} ${c.type}`).join(", ")}`).join("\n");
  const { text: response } = await generateText({
    model: ollamaClient.model,
    prompt: `Given the schema: ${metadata} Answer the question: ${question}`,
  });
  return response;
}

export async function POST(req: Request) {
  try {
    const sessionOrResponse = await requireAuth();
    if (sessionOrResponse instanceof Response) return sessionOrResponse;
    const session = sessionOrResponse;

    const { messages, url, blobs }: { messages: UIMessage[]; url?: string; blobs?: BlobFile[] } = await req.json();
    const hasBlobs = !!(blobs?.length);

    if (!url && !hasBlobs) {
      return fail("Ulanish manzili yoki fayl bering", 400);
    }

    let schema: Schema[] = [];
    try {
      if (url) {
        const type = detectDbType(url);
        const client = createDbClient(url);
        const repository = createSystemRepository(client, type);
        schema = await repository.loadSchema();
      } else {
        schema = await duckdbClient.loadSchemaFromUrls(blobs!);
      }
    } catch (error) {
      return fail(error, 400);
    }

    const sourceKey = url ?? blobs!.map((b) => b.name).join(",");
    const sourceHash = createHash("sha256").update(sourceKey).digest("hex").slice(0, 16);
    const namespace = `${session.user.id}:${sourceHash}`;

    const hasQuota = await userRepository.checkAndDecrementQueryCount(session.user.id);
    if (!hasQuota) {
      return fail("Hisobingizda so'rovlar tugagan", 403);
    }

    const modelMessages = await convertToModelMessages(messages);

    type Phase = "translator" | "generator" | "executor" | "done";

    function computePhase(msgs: typeof modelMessages): Phase {
      let phase: Phase = "translator";
      let failures = 0;
      const userIdx = msgs.findLastIndex((m) => m.role === "user");
      for (const msg of msgs.slice(userIdx + 1)) {
        if (phase === "done") break;
        if (msg.role !== "tool") continue;
        for (const part of msg.content) {
          if (phase === "done") break;
          if (part.type !== "tool-result") continue;
          const { toolName, output } = part;
          if (toolName === "translator") {
            phase = "generator";
          } else if (toolName === "generator") {
            const val = output.type === "json" ? (output.value as { irrelevant?: boolean }) : {};
            phase = val.irrelevant === true ? "done" : "executor";
          } else if (toolName === "executor") {
            const val = output.type === "json" ? (output.value as { success: boolean }) : { success: false };
            if (val.success) {
              phase = "done";
            } else {
              failures++;
              phase = failures < 3 ? "generator" : "done";
            }
          }
        }
      }
      return phase;
    }

    const result = streamText({
      model: anthropicClient.model,
      system: AGENT_PROMPT,
      messages: modelMessages,
      tools: {
        translator: tool({
          description: TOOL_DESCRIPTIONS.translator.tool,
          inputSchema: z.object({
            prompt: z.string().describe(TOOL_DESCRIPTIONS.translator.prompt),
          }),
          execute: async ({ prompt }) => ({ translation: await translator(prompt) }),
        }),
        generator: tool({
          description: TOOL_DESCRIPTIONS.generator.tool,
          inputSchema: z.object({
            question: z.string().describe(TOOL_DESCRIPTIONS.generator.question),
            errorContext: z.string().optional().describe(TOOL_DESCRIPTIONS.generator.errorContext),
          }),
          execute: async ({ question }) => {
            const generation = await generator(question, schema, namespace);
            if (generation === null) return { generation: null, irrelevant: true };
            return { generation };
          },
        }),
        executor: tool({
          description: TOOL_DESCRIPTIONS.executor.tool,
          inputSchema: z.object({
            query: z.string().describe(TOOL_DESCRIPTIONS.executor.query),
            summary: z.string().describe(TOOL_DESCRIPTIONS.executor.summary),
          }),
          needsApproval: true,
          execute: async ({ query }) => {
            try {
              const result = hasBlobs
                ? await duckdbClient.executeQueryFromUrls(query, blobs!)
                : await createDbClient(url!).executeQuery(query);
              return { result, success: true };
            } catch (error) {
              return {
                result: null,
                success: false,
                error: error instanceof Error ? error.message : "Xatolik yuz berdi",
              };
            }
          },
        }),
      },
      stopWhen: stepCountIs(10),
      prepareStep: ({ messages }) => {
        const phase = computePhase(messages);
        if (phase === "done") return { toolChoice: "none", activeTools: [] };
        return { toolChoice: "required", activeTools: [phase] };
      },
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => (error instanceof Error ? error.message : "Xatolik yuz berdi"),
    });
  } catch (error) {
    return fail(error, 500);
  }
}
