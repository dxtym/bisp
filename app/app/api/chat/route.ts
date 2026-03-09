import { z } from "zod";
import { NextResponse } from "next/server";
import {
  tool,
  streamText,
  stepCountIs,
  generateText,
  convertToModelMessages,
  UIMessage,
} from "ai";
import { auth } from "@/auth";
import { userRepository } from "@/lib/repository/user";
import { ClickHouseWebClient } from "@/lib/clickhouse/client";
import { Schema, SystemRepository } from "@/lib/repository/system";
import {
  AGENT_PROMPT,
  GENERATOR_PROMPT,
  TOOL_DESCRIPTIONS,
} from "@/app/api/chat/const";
import anthropicClient from "@/lib/agents/anthropic/client";

async function translator(prompt: string): Promise<string> {
  const response = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(prompt)}&langpair=uz|en`
  );
  const data = await response.json();
  return data.responseData.translatedText as string;
}

async function generator(question: string, schema: Schema[]): Promise<string> {
  const metadata = schema.map((t) => `${t.table}: ${t.columns.join(", ")}`).join("\n");
  const { text: response } = await generateText({
    model: anthropicClient.model,
    system: GENERATOR_PROMPT,
    prompt: `Schema: ${metadata} Answer this: ${question}`,
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

    const { messages, url }: { messages: UIMessage[]; url?: string } = await req.json();

    if (!url) {
      return NextResponse.json({
        success: false,
        message: "No connection URL provided",
      }, { status: 400 });
    }

    let schema: Schema[] = [];
    try {
      const client = new ClickHouseWebClient(url);
      const reposistory = new SystemRepository(client);
      schema = await reposistory.loadSchema();
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

    const result = streamText({
      model: anthropicClient.model,
      system: AGENT_PROMPT,
      messages: await convertToModelMessages(messages),
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
              const client = new ClickHouseWebClient(url);
              const response = await client.query({ query });
              const result = await response.json();
              return { result: result, success: true };
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
