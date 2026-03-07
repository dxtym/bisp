import { createOpenAI } from "@ai-sdk/openai";
import { type LanguageModel } from "ai";

interface OpenAIClientOptions {
  apiKey?: string;
  model?: string;
}

class OpenAIClient {
  private readonly _model: LanguageModel;

  constructor(options?: OpenAIClientOptions) {
    const provider = createOpenAI({ apiKey: options?.apiKey });
    this._model = provider(options?.model ?? "gpt-4o-mini");
  }

  get model(): LanguageModel {
    return this._model;
  }
}

const openAIClient = new OpenAIClient({
  model: process.env.OPENAI_MODEL!,
  apiKey: process.env.OPENAI_API_KEY!,
});

export default openAIClient;
