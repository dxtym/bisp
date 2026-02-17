import { z } from "zod";

import { createOllama } from "ollama-ai-provider-v2";
import { streamText, type ModelMessage, type LanguageModel } from "ai";

const OllamaClientOptions = z.object({
  baseUrl: z.string(),
  model: z.string(),
  username: z.string().optional(),
  password: z.string().optional(),
});
type OllamaClientOptions = z.infer<typeof OllamaClientOptions>;

class OllamaClient {
  private readonly model: LanguageModel;

  constructor(options?: OllamaClientOptions) {
    const headers: Record<string, string> = {};

    if (options?.username && options?.password) {
      const credentials = Buffer.from(`${options.username}:${options.password}`).toString("base64");
      headers["Authorization"] = `Basic ${credentials}`;
    }

    const provider = createOllama({
      baseURL: options?.baseUrl,
      headers: headers,
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
  username: process.env.OLLAMA_USERNAME,
  password: process.env.OLLAMA_PASSWORD,
});

export default ollamaClient;
