import { z } from "zod";

import { createOpenAI } from "@ai-sdk/openai";
import { generateText, type ModelMessage, type LanguageModel } from "ai";

const OpenAIClientOptions = z.object({
  model: z.string(),
  apiKey: z.string(),
  temperature: z.number().optional(),
});
type OpenAIClientOptions = z.infer<typeof OpenAIClientOptions>;

class OpenAIClient {
  private readonly _model: LanguageModel;

  constructor(options?: OpenAIClientOptions) {
    const provider = createOpenAI({
      apiKey: options?.apiKey,
    });
    this._model = provider(options?.model ?? "gpt-4o-mini");
  }

  public get model(): LanguageModel {
    return this._model;
  }

  public async call(messages: ModelMessage[]): Promise<string> {
    try {
      const { text } = await generateText({
        model: this._model,
        system: `
          You are a translator of Uzbek to English. Do not use markdown.
          Do not explain your answer. Only single message answer allowed.
        `,
        messages: [messages[messages.length - 1]],
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
