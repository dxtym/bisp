import { mongoDbConnect } from "@/lib/mongodb/client"
import { Subscription, type ISubscription } from "@/lib/mongodb/models/subscription"
import { BaseRepository } from "@/lib/repository/base"

class SubscriptionRepository extends BaseRepository {
  protected async connect(): Promise<void> {
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
    return this.run("Create subscription error", () =>
      Subscription.create(args).then((s) => s.toObject())
    )
  }

  public async getByUserId(userId: string): Promise<ISubscription | null> {
    return this.run("Get subscription error", () =>
      Subscription.findOne({ userId }).sort({ createdAt: -1 }).lean() as Promise<ISubscription | null>
    )
  }
}

export const subscriptionRepository = new SubscriptionRepository()
