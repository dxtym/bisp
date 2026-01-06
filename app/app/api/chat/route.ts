import * as z from "zod"
import { createUIMessageStreamResponse, UIMessage } from 'ai';
import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';

import { tool } from '@langchain/core/tools';
import { ChatOllama } from "@langchain/ollama";
import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';

import { SystemRepository } from "@/lib/repository/system.repository";

const systemRepo = new SystemRepository();

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

// TODO: Clean this
// const getSchemaTool = tool(
//   async () => {
//     const schema = [];
//     const tables = await systemRepo.getTables();
//     tables.forEach(async (table: Table) => {
//       const columns = await systemRepo.getColumns(table.name);
//       schema.push({
//         table: table.name,
//         columns: columns.map(col => col.name),
//       })
//     })

//     return JSON.stringify(schema);
//   },
//   {
//     name: "get_schema",
//     description: "Get database schema",
//     schema: z.object(),
//   }
// )

// TODO: Move to env variables
const model = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "qwen2sql",
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // TODO: Add tool call, translation, summarizer
  const graph = new StateGraph(MessagesAnnotation)
    .addNode('agent', callModel)
    .addEdge('__start__', 'agent')
    .addEdge('agent', '__end__')
    .compile();

  const langchainMessages = await toBaseMessages(messages);

  const stream = await graph.stream(
    { messages: langchainMessages },
    { streamMode: ['values', 'messages'] },
  );

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}
