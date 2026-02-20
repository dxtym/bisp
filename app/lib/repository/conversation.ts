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
        id: crypto.randomUUID(),
        userId: userId,
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
        .sort({ createdAt: -1 })
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
        .findOne({ id: conversationId })
        .lean<IConversation | null>();
      return doc;
    } catch (error) {
      throw new Error(`Get conversation by id error: ${error}`);
    }
  }

  public async addMessage(conversationId: string, message: IMessage): Promise<IConversation | null> {
    try {
      await this.connect();
      const doc = await Conversation.findOneAndUpdate(
        { id: conversationId },
        { $push: { messages: message } },
        { new: true },
      ).lean<IConversation | null>();
      return doc;
    } catch (error) {
      throw new Error(`Add message error: ${error}`);
    }
  }

  public async updateTitle(conversationId: string, title: string): Promise<IConversation | null> {
    try {
      await this.connect();
      const doc = await Conversation.findOneAndUpdate(
        { id: conversationId },
        { title: title },
        { new: true },
      ).lean<IConversation | null>();
      return doc;
    } catch (error) {
      throw new Error(`Update conversation title error: ${error}`);
    }
  }

  public async delete(conversationId: string): Promise<boolean> {
    try {
      await this.connect();
      const result = await Conversation.deleteOne({ id: conversationId });
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error(`Delete conversation error: ${error}`);
    }
  }
}
