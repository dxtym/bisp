import { mongoDbConnect } from "@/lib/mongodb/client";
import {
  Conversation,
  type IConversation,
  type IMessage,
} from "@/lib/mongodb/models/conversation";

export class ConversationRepository {
  private async connect(): Promise<void> {
    await mongoDbConnect();
  }

  public async create(userId: string, title?: string): Promise<IConversation> {
    try {
      await this.connect();

      const doc = await Conversation.create({
        userId: userId,
        conversationId: crypto.randomUUID(),
        title: title,
        messages: [],
      });

      return doc.toObject() as IConversation;
    } catch (error) {
      throw new Error(`Create conversation error: ${error}`);
    }
  }

  public async getAll(userId: string): Promise<IConversation[]> {
    try {
      await this.connect();

      const docs = await Conversation
        .find({ userId })
        .sort({ updatedAt: -1 })
        .lean<IConversation[]>();

      return docs;
    } catch (error) {
      throw new Error(`Get all conversations error: ${error}`);
    }
  }

  public async getById(conversationId: string): Promise<IConversation | null> {
    try {
      await this.connect();

      const doc = await Conversation
        .findOne({ conversationId })
        .lean<IConversation | null>();

      return doc;
    } catch (error) {
      throw new Error(`Get conversation by id error: ${error}`);
    }
  }

  public async updateMessages(conversationId: string, messages: IMessage[]): Promise<IConversation | null> {
    try {
      await this.connect();

      const doc = await Conversation.findOneAndUpdate(
        { conversationId },
        { $set: { messages } },
        { new: true },
      ).lean<IConversation | null>();

      return doc;
    } catch (error) {
      throw new Error(`Update conversation messages error: ${error}`);
    }
  }
}
