import mongoose from "mongoose";

export interface IUser {
  clerkId: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
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
  },
  { timestamps: true }
);

userSchema.index({ clerkId: 1 });
userSchema.index({ email: 1 });

export type User = mongoose.InferSchemaType<typeof userSchema>;

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
