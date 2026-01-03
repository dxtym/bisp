import { ChatOllama } from "@langchain/ollama";
import { createUIMessageStreamResponse, UIMessage } from 'ai';
import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // TODO: model not answering as was finetuned
  const model = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "qwen2sql",
  });

  const langchainMessages = await toBaseMessages(messages);

  const stream = await model.stream(langchainMessages);

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}
