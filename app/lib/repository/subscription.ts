import { mongoDbConnect } from "@/lib/mongodb/client"
import { Subscription, type ISubscription } from "@/lib/mongodb/models/subscription"

class SubscriptionRepository {
  private async connect(): Promise<void> {
    await mongoDbConnect()
  }

  public async createSubscription(args: {
    userId: string
    plan: "pro" | "max" | "team"
    stripeCustomerId: string
    stripeSubscriptionId: string
    stripeSessionId: string
    status: string
    currentPeriodEnd: Date
  }): Promise<ISubscription> {
    await this.connect()

    try {
      const subscription = await Subscription.create(args)
      return subscription.toObject()
    } catch (error) {
      throw new Error(`Create subscription error: ${error}`)
    }
  }

  public async getByUserId(userId: string): Promise<ISubscription | null> {
    await this.connect()

    try {
      return await Subscription.findOne({ userId }).sort({ createdAt: -1 }).lean()
    } catch (error) {
      throw new Error(`Get subscription error: ${error}`)
    }
  }
}

export const subscriptionRepository = new SubscriptionRepository()
