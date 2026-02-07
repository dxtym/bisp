import { z } from "zod";

import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage, type LanguageModel } from "ai";

const OllamaClientOptions = z.object({
  baseUrl: z.string(),
  model: z.string(),
});
type OllamaClientOptions = z.infer<typeof OllamaClientOptions>;

class OllamaClient {
  private readonly model: LanguageModel;

  constructor(options?: OllamaClientOptions) {
    const provider = createOpenAI({
      baseURL: `${options?.baseUrl}/v1`,
      apiKey: "ollama",
    });
    this.model = provider(options?.model ?? "llama3");
  }

  public stream(messages: ModelMessage[]) {
    try {
      return streamText({
        model: this.model,
        messages,
      });
    } catch (error) {
      throw new Error(`Ollama error: ${error}`);
    }
  }
}

const ollamaClient = new OllamaClient({
  baseUrl: process.env.OLLAMA_URL!,
  model: process.env.OLLAMA_MODEL!,
});

export default ollamaClient;
