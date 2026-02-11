import openAIClient from "@/lib/agents/openai/client";
import ollamaClient from "@/lib/agents/ollama/client";
import { ClickHouseWebClient } from "@/lib/clickhouse/client";
import { SystemRepository } from "@/lib/repository/system";
import { convertToModelMessages } from "ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const messageContent = await convertToModelMessages(messages);
    const translatedText = await openAIClient.call(messageContent);

    const client = ClickHouseWebClient.getInstance();
    const systemRepository = new SystemRepository(client);
    const schema = await systemRepository.loadSchema();

    const result = ollamaClient.stream([
      {
        role: "user",
        content: `
          Given the schema: ${JSON.stringify(schema)}.
          Answer the question: ${translatedText}
        `,
      },
    ]);

    return result.toUIMessageStreamResponse();
  } catch (error) {
    throw new Error(`Chat error: ${error}`);
  }
}
