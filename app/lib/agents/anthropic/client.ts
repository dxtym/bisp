import { createAnthropic } from "@ai-sdk/anthropic";
import { type LanguageModel } from "ai";

interface AnthropicClientOptions {
  apiKey?: string;
  model?: string;
}

class AnthropicClient {
  private readonly _model: LanguageModel;

  constructor(options?: AnthropicClientOptions) {
    const provider = createAnthropic({ apiKey: options?.apiKey });
    this._model = provider(options?.model ?? "claude-haiku-4-5-20251001");
  }

  get model(): LanguageModel {
    return this._model;
  }
}

const anthropicClient = new AnthropicClient({
  model: process.env.ANTHROPIC_MODEL,
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export default anthropicClient;
