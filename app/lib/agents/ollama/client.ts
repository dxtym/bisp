import { z } from "zod";

import { Message } from "@/app/(chat)/api/chat/types";

import { ChatOllama } from "@langchain/ollama";
import { BaseMessage } from "@langchain/core/messages";

const OllamaClientOptions = z.object({
  baseUrl: z.string(),
  model: z.string(),
});
type OllamaClientOptions = z.infer<typeof OllamaClientOptions>;

class OllamaClient {
  private readonly model: ChatOllama;

  constructor(options?: OllamaClientOptions) {
    this.model = new ChatOllama({
      baseUrl: options?.baseUrl,
      model: options?.model,
    });
  }

  public async call(messages: BaseMessage[]): Promise<Message> {
    try {
      const response = await this.model.invoke(messages);
      return { messages: [response] } as Message;
    } catch (error) {
      throw new Error(`Ollama error: ${error}`);
    }
  }
}

const ollamaClient = new OllamaClient({
  baseUrl: process.env.OLLAMA_URL!,
  model: process.env.OLLAMA_MODEL!
})

export default ollamaClient;
