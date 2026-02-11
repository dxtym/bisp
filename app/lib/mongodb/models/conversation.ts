import mongoose from "mongoose";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface IConversation {
  id: string;
  userId: string;
  title: string;
  messages: IMessage[];
  createdAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
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
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    messages: {
      type: [messageSchema],
      default: []
    },
  },
  { _id: true, timestamps: true }
);

conversationSchema.index({ id: 1, userId: 1 });

export type Message = mongoose.InferSchemaType<typeof messageSchema>;
export type Conversation = mongoose.InferSchemaType<typeof conversationSchema>;

export const Message = mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", conversationSchema);
