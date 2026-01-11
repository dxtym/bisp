import { z } from "zod";

import { Message } from "@/app/(chat)/api/chat/types";

import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage } from "@langchain/core/messages";

const OpenAIClientOptions = z.object({
  model: z.string(),
  apiKey: z.string(),
  temperature: z.number().optional(),
});
type OpenAIClientOptions = z.infer<typeof OpenAIClientOptions>;

class OpenAIClient {
  private readonly model: ChatOpenAI;

  constructor(options?: OpenAIClientOptions) {
    this.model = new ChatOpenAI({
      model: options?.model,
      apiKey: options?.apiKey,
      temperature: options?.temperature,
    })
  }

  public async call(messages: BaseMessage[]): Promise<Message> {
    try {
      const response = await this.model.invoke(messages);
      return { messages: [response] } as Message;
    } catch (error) {
      throw new Error(`OpenAI error: ${error}`);
    }
  }
}

const openAIClient = new OpenAIClient({
  model: process.env.OPENAI_MODEL!,
  apiKey: process.env.OPENAI_API_KEY!,
})

export default openAIClient;
