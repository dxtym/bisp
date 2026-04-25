import mongoose from "mongoose"

export interface IWebhookEvent {
  provider: string
  eventId: string
  createdAt: Date
}

const webhookEventSchema = new mongoose.Schema<IWebhookEvent>(
  {
    provider: { type: String, required: true },
    eventId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

webhookEventSchema.index({ provider: 1, eventId: 1 }, { unique: true })

export const WebhookEvent =
  mongoose.models.WebhookEvent ||
  mongoose.model<IWebhookEvent>("WebhookEvent", webhookEventSchema)
