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
import { ClickHouseWebClient } from "@/lib/clickhouse/client";
import { Schema, SystemRepository } from "@/lib/repository/system";
import {
  AGENT_PROMPT,
  GENERATOR_PROMPT,
  TRANSLATOR_PROMPT,
} from "@/app/api/chat/const";
// import openAIClient from "@/lib/agents/openai/client";
// import ollamaClient from "@/lib/agents/ollama/client";
import anthropicClient from "@/lib/agents/anthropic/client";

async function translator(prompt: string): Promise<string> {
  const { text: response } = await generateText({
    model: anthropicClient.model,
    system: TRANSLATOR_PROMPT,
    prompt: prompt,
  });
  return response;
}

async function generator(question: string, schema: Schema[]): Promise<string> {
  const metadata = schema.map((t) => `${t.table}: ${t.columns.join(", ")}`).join("\n");
  const { text: response } = await generateText({
    model: anthropicClient.model,
    system: GENERATOR_PROMPT,
    prompt: `Given the schema: ${metadata} Answer the question: ${question}`,
  });
  return response;
}

// async function generator(question: string, schema: Schema[]): Promise<string> {
//   const metadata = schema.map((t) => `${t.table}: ${t.columns.join(", ")}`).join("\n");
//   const { text: response } = await ollamaClient.generate(
//     `Given the schema: ${metadata} Answer the question: ${question}`,
//   );
//   return response;
// }

export async function POST(req: Request) {
  try {
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
        message: error instanceof Error ? error.message : "Something went wrong",
      }, { status: 400 });
    }

    const result = streamText({
      model: anthropicClient.model,
      system: AGENT_PROMPT,
      messages: await convertToModelMessages(messages),
      tools: {
        translator: tool({
          inputSchema: z.object({ prompt: z.string() }),
          execute: async ({ prompt }) => ({ translation: await translator(prompt) }),
        }),
        generator: tool({
          inputSchema: z.object({ question: z.string() }),
          execute: async ({ question }) => ({ generation: await generator(question, schema) }),
        }),
        executor: tool({
          inputSchema: z.object({ query: z.string() }),
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
                error: error instanceof Error ? error.message : "Something went wrong",
              };
            }
          },
        }),
      },
      stopWhen: stepCountIs(10),
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => (error instanceof Error ? error.message : "Xatolik"),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    }, { status: 500 });
  }
}
