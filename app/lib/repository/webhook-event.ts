import { mongoDbConnect } from "@/lib/mongodb/client"
import { WebhookEvent } from "@/lib/mongodb/models/webhook-event"
import { BaseRepository } from "@/lib/repository/base"

const DUPLICATE_KEY = 11000

class WebhookEventRepository extends BaseRepository {
  protected async connect(): Promise<void> {
    await mongoDbConnect()
  }

  public async markProcessed(provider: string, eventId: string): Promise<boolean> {
    return this.run("Mark webhook event error", async () => {
      try {
        await WebhookEvent.create({ provider, eventId })
        return true
      } catch (error) {
        if ((error as { code?: number }).code === DUPLICATE_KEY) return false
        throw error
      }
    })
  }
}

export const webhookEventRepository = new WebhookEventRepository()
