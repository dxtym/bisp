import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getStripe } from "@/lib/stripe"

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  max: process.env.STRIPE_MAX_PRICE_ID!,
  team: process.env.STRIPE_TEAM_PRICE_ID!,
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { plan } = await req.json()
    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json({ message: "Invalid plan" }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      success_url: `${appUrl}/checkout/success`,
      cancel_url: `${appUrl}/pricing`,
      metadata: { userId: session.user.id, plan },
      subscription_data: { metadata: { userId: session.user.id, plan } },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Xatolik yuz berdi" },
      { status: 500 }
    )
  }
}
