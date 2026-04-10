import mongoose from "mongoose"

export interface ISubscription {
  userId: string
  plan: "pro" | "max" | "team"
  stripeCustomerId: string
  stripeSubscriptionId: string
  stripeSessionId: string
  status: string
  currentPeriodEnd: Date
  createdAt: Date
  updatedAt: Date
}

const subscriptionSchema = new mongoose.Schema<ISubscription>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["pro", "max", "team"],
      required: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeSessionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
)

export const Subscription =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", subscriptionSchema)
