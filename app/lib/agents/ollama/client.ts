import { createOllama } from "ollama-ai-provider-v2";
import { type LanguageModel } from "ai";

class OllamaClient {
  private readonly _model: LanguageModel;

  constructor() {
    const provider = createOllama({ baseURL: `${process.env.OLLAMA_URL}/api` });
    this._model = provider(process.env.OLLAMA_MODEL ?? "llama3.2");
  }

  get model(): LanguageModel {
    return this._model;
  }
}

const ollamaClient = new OllamaClient();
export default ollamaClient;
