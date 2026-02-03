import mongoose from "mongoose";

export interface IMessage {
  senderId: string,
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

export interface IConversation {
  userId: string;
  conversationId: string;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    senderId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      default: "user",
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: () => new Date()
    },
  },
  { _id: true }
);

const conversationSchema = new mongoose.Schema<IConversation>(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    conversationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: false
    },
    messages: {
      type: [messageSchema],
      default: []
    },
  },
  { timestamps: true }
);

conversationSchema.index({ userId: 1, conversationId: 1 });

export type Message = mongoose.InferSchemaType<typeof messageSchema>;
export type Conversation = mongoose.InferSchemaType<typeof conversationSchema>;

export const Message = mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", conversationSchema);
