import { mongoDbConnect } from "@/lib/mongodb/client";
import { Conversation, type IConversation, type IMessage } from "@/lib/mongodb/models/conversation";
import { BaseRepository } from "@/lib/repository/base";

export class ConversationRepository extends BaseRepository {
  protected async connect(): Promise<void> {
    await mongoDbConnect();
  }

  public async create(userId: string, title?: string): Promise<IConversation> {
    return this.run("Create conversation error", () =>
      Conversation.create({ id: crypto.randomUUID(), userId, title, messages: [] })
        .then((doc) => doc.toObject() as IConversation)
    );
  }

  public async getAll(userId: string): Promise<IConversation[]> {
    return this.run("Get all conversations error", () =>
      Conversation.find({ userId }).sort({ createdAt: -1 }).lean<IConversation[]>()
    );
  }

  public async getById(conversationId: string): Promise<IConversation | null> {
    return this.run("Get conversation by id error", () =>
      Conversation.findOne({ id: conversationId }).lean<IConversation | null>()
    );
  }

  public async addMessage(conversationId: string, message: IMessage): Promise<IConversation | null> {
    return this.run("Add message error", () =>
      Conversation.findOneAndUpdate(
        { id: conversationId },
        { $push: { messages: message } },
        { new: true }
      ).lean<IConversation | null>()
    );
  }

  public async updateTitle(conversationId: string, title: string): Promise<IConversation | null> {
    return this.run("Update conversation title error", () =>
      Conversation.findOneAndUpdate(
        { id: conversationId },
        { title },
        { new: true }
      ).lean<IConversation | null>()
    );
  }

  public async delete(conversationId: string): Promise<boolean> {
    return this.run("Delete conversation error", async () => {
      const result = await Conversation.deleteOne({ id: conversationId });
      return result.deletedCount > 0;
    });
  }

  public async setPinned(conversationId: string, isPinned: boolean): Promise<IConversation | null> {
    return this.run("Set pinned error", () =>
      Conversation.findOneAndUpdate(
        { id: conversationId },
        { isPinned },
        { new: true }
      ).lean<IConversation | null>()
    );
  }

  public async setShareToken(conversationId: string, token: string | null): Promise<IConversation | null> {
    return this.run("Set share token error", () =>
      Conversation.findOneAndUpdate(
        { id: conversationId },
        token === null ? { $unset: { shareToken: "" } } : { shareToken: token },
        { new: true }
      ).lean<IConversation | null>()
    );
  }

  public async getByShareToken(token: string): Promise<IConversation | null> {
    return this.run("Get by share token error", () =>
      Conversation.findOne({ shareToken: token }).lean<IConversation | null>()
    );
  }
}
