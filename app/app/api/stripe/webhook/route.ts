import { NextRequest } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe"
import { subscriptionRepository } from "@/lib/repository/subscription"
import { userRepository } from "@/lib/repository/user"
import { webhookEventRepository } from "@/lib/repository/webhook-event"
import { ok, fail } from "@/lib/api/response"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")
  if (!sig) {
    return fail("Missing stripe-signature", 400)
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return fail("Webhook signature verification failed", 400)
  }

  const fresh = await webhookEventRepository.markProcessed("stripe", event.id)
  if (!fresh) {
    return ok({ received: true, type: event.type, idempotent: true })
  }

  if (event.type !== "checkout.session.completed") {
    return ok({ received: true, type: event.type, handled: false })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const userId = session.metadata?.userId
  const plan = session.metadata?.plan as "pro" | "max" | "team"
  if (!userId || !plan) {
    return fail("Missing metadata", 400)
  }

  const subscription = await getStripe().subscriptions.retrieve(session.subscription as string)

  await subscriptionRepository.createSubscription({
    userId,
    plan,
    stripeCustomerId: session.customer as string,
    stripeSubscriptionId: subscription.id,
    stripeSessionId: session.id,
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
  })

  await userRepository.updatePlan(userId, plan)

  return ok({ received: true, type: event.type, handled: true })
}
