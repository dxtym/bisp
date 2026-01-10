import { z } from "zod";

import { IAgent } from "../interface";
import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage } from "@langchain/core/messages";


const OpenAIClientOptions = z.object({
  model: z.string(),
  apiKey: z.string(),
  temperature: z.number().optional(),
});
type OpenAIClientOptions = z.infer<typeof OpenAIClientOptions>;

class OpenAIClient implements IAgent {
  private readonly model: ChatOpenAI;

  constructor(options?: OpenAIClientOptions) {
    this.model = new ChatOpenAI({
      model: options?.model,
      apiKey: options?.apiKey,
      temperature: options?.temperature ?? 0,
    })
  }

  public async call(messages: BaseMessage[]): Promise<{ messages: BaseMessage[] }> {
    console.log(messages);
    const response = await this.model.invoke(messages);
    console.log(response.content);
    return { messages: [response] };
  }
}

const openAIClient = new OpenAIClient({
  model: process.env.OPENAI_MODEL!,
  apiKey: process.env.OPENAI_API_KEY!,
})

export default openAIClient;
