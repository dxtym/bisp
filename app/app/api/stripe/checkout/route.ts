import { getStripe } from "@/lib/stripe"
import { ok, fail } from "@/lib/api/response"
import { requireAuth } from "@/lib/api/auth"

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  max: process.env.STRIPE_MAX_PRICE_ID!,
  team: process.env.STRIPE_TEAM_PRICE_ID!,
}

export async function POST(req: Request) {
  try {
    const sessionOrResponse = await requireAuth()
    if (sessionOrResponse instanceof Response) return sessionOrResponse
    const session = sessionOrResponse

    const { plan } = await req.json()
    if (!plan || !PRICE_IDS[plan]) {
      return fail("Invalid plan", 400)
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

    return ok({ url: checkoutSession.url })
  } catch (error) {
    return fail(error, 500)
  }
}
