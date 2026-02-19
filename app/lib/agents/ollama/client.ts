import { z } from "zod";
import { Ollama } from "ollama";

const OllamaClientOptions = z.object({
  baseUrl: z.string(),
  username: z.string().optional(),
  password: z.string().optional(),
});
type OllamaClientOptions = z.infer<typeof OllamaClientOptions>;

class OllamaClient {
  private readonly ollama: Ollama;

  constructor(options?: OllamaClientOptions) {
    const headers: Record<string, string> = {};

    if (options?.username && options?.password) {
      const credentials = Buffer.from(`${options.username}:${options.password}`).toString("base64");
      headers["Authorization"] = `Basic ${credentials}`;
    }

    this.ollama = new Ollama({
      host: options?.baseUrl,
      headers: headers,
    });
  }

  public async generate(prompt: string): Promise<{ text: string }> {
    try {
      const response = await this.ollama.generate({
        model: process.env.OLLAMA_MODEL!,
        prompt: prompt,
        stream: false,
      });
      return { text: response.response };
    } catch (error) {
      throw new Error(`Ollama error: ${error}`);
    }
  }
}

const ollamaClient = new OllamaClient({
  baseUrl: process.env.OLLAMA_URL!,
  username: process.env.OLLAMA_USERNAME,
  password: process.env.OLLAMA_PASSWORD,
});

export default ollamaClient;
