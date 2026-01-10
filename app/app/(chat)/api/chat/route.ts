import { Schema } from "./types";

import { createUIMessageStreamResponse } from "ai";
import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";

import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph";

import openAIClient from "@/lib/agents/openai/client";
import ollamaClient from "@/lib/agents/ollama/client";
import { SystemRepository } from "@/lib/repository/system.repository";
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

const systemRepo = new SystemRepository();

// TODO: move upper the tree
async function getSchema(): Promise<string> {
  const tables = await systemRepo.getTables();

  const schemas: Schema[] = [];
  for (const table of tables) {
    const columns = await systemRepo.getColumns(table.name);
    schemas.push({
      table: table.name,
      columns: columns.map(col => col.name),
    } as Schema);
  }

  return JSON.stringify(schemas);
}

async function callOpenAI(state: typeof MessagesAnnotation.State): Promise<{ messages: BaseMessage[] }> {
  const messages = [
    new SystemMessage(`
      You are a translator of Uzbek to English. Do not use markdown.
      Do not explain your answer. Only single message answer allowed.
    `),
    ...state.messages
  ]
  console.log(messages);

  const response = await openAIClient.call(messages);
  return {
    messages: [...response.messages]
  }
}

async function callOllama(state: typeof MessagesAnnotation.State): Promise<{ messages: BaseMessage[] }> {
  const schema = await getSchema();
  const messages = [
    ...state.messages.slice(0, -1),
    new HumanMessage(`
      Given the schema: ${schema}.
      Answer the question: ${state.messages.at(-1)?.content}
    `)
  ]
  console.log(messages);

  const response = await ollamaClient.call(messages);
  return {
    messages: [...response.messages]
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const graph = new StateGraph(MessagesAnnotation)
    .addNode("translator", callOpenAI)
    .addNode("text2sql", callOllama)
    .addEdge(START, "translator")
    .addEdge("translator", "text2sql")
    .addEdge("text2sql", END)
    .compile();

  const baseMessages = await toBaseMessages(messages);

  const stream = await graph.stream(
    { messages: baseMessages },
    { streamMode: ["values", "messages"] },
  );

  console.log("graph started")

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}
