import { z } from "zod";

import { createOpenAI } from "@ai-sdk/openai";
import { generateText, type ModelMessage, type LanguageModel } from "ai";

const TRANSLATOR_SYSTEM_PROMPT = `You are a translator of Uzbek to English. Do not use markdown. Do not explain your answer. Only single message answer allowed.`;

const OpenAIClientOptions = z.object({
  model: z.string(),
  apiKey: z.string(),
  temperature: z.number().optional(),
});
type OpenAIClientOptions = z.infer<typeof OpenAIClientOptions>;

class OpenAIClient {
  private readonly model: LanguageModel;

  constructor(options?: OpenAIClientOptions) {
    const provider = createOpenAI({
      apiKey: options?.apiKey,
    });
    this.model = provider(options?.model ?? "gpt-4o-mini");
  }

  public async call(messages: ModelMessage[]): Promise<string> {
    try {
      const { text } = await generateText({
        model: this.model,
        system: TRANSLATOR_SYSTEM_PROMPT,
        messages,
      });
      return text;
    } catch (error) {
      throw new Error(`OpenAI error: ${error}`);
    }
  }
}

const openAIClient = new OpenAIClient({
  model: process.env.OPENAI_MODEL!,
  apiKey: process.env.OPENAI_API_KEY!,
});

export default openAIClient;
