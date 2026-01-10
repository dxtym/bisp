import { z } from "zod";

import { IAgent } from "../interface";
import { ChatOllama } from "@langchain/ollama";
import { BaseMessage } from "@langchain/core/messages";

const OllamaClientOptions = z.object({
  baseUrl: z.string(),
  model: z.string(),
});
type OllamaClientOptions = z.infer<typeof OllamaClientOptions>;

class OllamaClient implements IAgent {
  private readonly model: ChatOllama;

  constructor(options?: OllamaClientOptions) {
    this.model = new ChatOllama({
      baseUrl: options?.baseUrl,
      model: options?.model,
    });
  }

  public async call(messages: BaseMessage[]): Promise<{ messages: BaseMessage[] }> {
    console.log(messages);
    const response = await this.model.invoke(messages);
    console.log(response);
    return { messages: [response] };
  }
}

const ollamaClient = new OllamaClient({
  baseUrl: process.env.OLLAMA_URL!,
  model: process.env.OLLAMA_MODEL!
})

export default ollamaClient;
