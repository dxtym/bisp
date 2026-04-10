import { z } from "zod";
import { NextResponse } from "next/server";
import {
  tool,
  streamText,
  stepCountIs,
  generateText,
  convertToModelMessages,
} from "ai";
import type { UIMessage } from "ai";
import { auth } from "@/auth";
import { userRepository } from "@/lib/repository/user";
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

async function translator(prompt: string): Promise<string> {
  const { text } = await generateText({
    model: openaiClient.model,
    system: "Translate the given Uzbek text to English. Output only the translation.",
    prompt,
  });
  return text;
}

async function generator(question: string, schema: Schema[]): Promise<string> {
  const metadata = schema.map((t) => `${t.table}: ${t.columns.map((c) => `${c.name} ${c.type}`).join(", ")}`).join("\n");
  const { text: response } = await generateText({
    model: ollamaClient.model,
    prompt: `Given the schema: ${metadata} Answer the question: ${question}`,
  });
  return response;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({
        message: "Unauthorized"
      }, { status: 401 });
    }

    const { messages, url, blobs }: { messages: UIMessage[]; url?: string; blobs?: BlobFile[] } = await req.json();
    const hasBlobs = !!(blobs?.length);

    if (!url && !hasBlobs) {
      return NextResponse.json({
        success: false,
        message: "Ulanish manzili yoki fayl bering",
      }, { status: 400 });
    }

    let schema: Schema[] = [];
    try {
      if (hasBlobs) {
        schema = await duckdbClient.loadSchemaFromUrls(blobs!);
      } else {
        const type = detectDbType(url!);
        const client = createDbClient(url!);
        const repository = createSystemRepository(client, type);
        schema = await repository.loadSchema();
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: error instanceof Error ? error.message : "Xatolik yuz berdi",
      }, { status: 400 });
    }

    const hasQuota = await userRepository.checkAndDecrementQueryCount(session.user.id);
    if (!hasQuota) {
      return NextResponse.json({ message: "Hisobingizda so'rovlar tugagan" }, { status: 403 });
    }

    const modelMessages = await convertToModelMessages(messages);
    const lastUserIdx = modelMessages.findLastIndex((m) => m.role === "user");
    let toolStepCount = modelMessages.slice(lastUserIdx + 1).filter((m) => m.role === "tool").length;

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
          }),
          execute: async ({ question }) => ({ generation: await generator(question, schema) }),
        }),
        executor: tool({
          description: TOOL_DESCRIPTIONS.executor.tool,
          inputSchema: z.object({
            query: z.string().describe(TOOL_DESCRIPTIONS.executor.query),
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
      prepareStep: () => {
        if (toolStepCount < 3) {
          return { toolChoice: "required" };
        }
        return { toolChoice: "none", activeTools: [] };
      },
      onStepFinish: ({ toolCalls }) => {
        if (toolCalls.length > 0) toolStepCount++;
      },
      onFinish: () => {
        toolStepCount = 0;
      },
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => (error instanceof Error ? error.message : "Xatolik yuz berdi"),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Xatolik yuz berdi",
    }, { status: 500 });
  }
}
