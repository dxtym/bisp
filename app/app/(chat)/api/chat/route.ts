import { Message } from "./types";

import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

import openAIClient from "@/lib/agents/openai/client";
import ollamaClient from "@/lib/agents/ollama/client";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph";
import { ClickHouseWebClient } from "@/lib/clickhouse/client";
import { SystemRepository } from "@/app/_repository/system";

const graph = new StateGraph(MessagesAnnotation)
  .addNode("translator", translate)
  .addNode("generator", generate)
  .addEdge(START, "translator")
  .addEdge("translator", "generator")
  .addEdge("generator", END)
  .compile();

async function translate(state: typeof MessagesAnnotation.State): Promise<Message> {
  try {
    const messages = [
      new SystemMessage(`
        You are a translator of Uzbek to English. Do not use markdown.
        Do not explain your answer. Only single message answer allowed.
      `),
      ...state.messages
    ]

    const response = await openAIClient.call(messages);
    return { messages: [...response.messages] } as Message;
  } catch (error) {
    throw new Error(`Translate error: ${error}`);
  }
}

async function generate(state: typeof MessagesAnnotation.State): Promise<Message> {
  try {
    const client = ClickHouseWebClient.getInstance();
    const systemRepository = new SystemRepository(client);

    const schema = await systemRepository.loadSchema();
    const messages = [
      new HumanMessage(`
        Given the schema: ${JSON.stringify(schema)}.
        Answer the question: ${state.messages.at(-1)?.content}
      `)
    ]

    // TODO: switch to Ollama on production
    // const response = await ollamaClient.call(messages);
    const response = await openAIClient.call(messages);
    return { messages: [...response.messages] } as Message;
  } catch (error) {
    throw new Error(`Generate error: ${error}`);
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const baseMessages = await toBaseMessages(messages);
    const stream = await graph.stream(
      { messages: baseMessages },
      { streamMode: ["values", "messages"] },
    );

    // TODO: filter stream message by only last node message
    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (error) {
    throw new Error(`Chat error: ${error}`);
  }
}
