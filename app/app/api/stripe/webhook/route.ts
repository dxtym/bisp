import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { subscriptionRepository } from "@/lib/repository/subscription"
import { userRepository } from "@/lib/repository/user"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.userId
    const plan = session.metadata?.plan as "pro" | "max" | "team"

    if (!userId || !plan) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

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
  }

  return NextResponse.json({ received: true })
}
