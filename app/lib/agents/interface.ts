import { BaseMessage } from "@langchain/core/messages";

export interface IAgent {
  call(messages: BaseMessage[]): Promise<{ messages: BaseMessage[] }>;
}
