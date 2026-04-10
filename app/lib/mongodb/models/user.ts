import mongoose from "mongoose";

export interface IUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  passwordHash?: string;
  queriesCount: number;
  plan: "free" | "pro" | "max" | "team";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    image: {
      type: String,
    },
    passwordHash: {
      type: String,
    },
    queriesCount: {
      type: Number,
      default: 5,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "max", "team"],
      default: "free",
    },
  },
  { timestamps: true }
);

export type User = mongoose.InferSchemaType<typeof userSchema>;

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
