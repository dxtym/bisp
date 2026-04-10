import { createOpenAI } from "@ai-sdk/openai";
import { type LanguageModel } from "ai";

class OpenAIClient {
  private readonly _model: LanguageModel;

  constructor() {
    const provider = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    this._model = provider(process.env.OPENAI_MODEL ?? "gpt-4o");
  }

  get model(): LanguageModel {
    return this._model;
  }
}

const openaiClient = new OpenAIClient();
export default openaiClient;
