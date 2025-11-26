import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import type Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    // In production, you should use a webhook secret
    // For now, we'll just parse the event
    event = JSON.parse(body) as Stripe.Event
  } catch (err) {
    console.error("[v0] Webhook parsing error:", err)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session

      // Update order payment status
      if (session.metadata) {
        try {
          await sql`
            UPDATE orders 
            SET payment_status = 'paid'
            WHERE stripe_session_id = ${session.id}
          `
        } catch (error) {
          console.error("[v0] Error updating order payment status:", error)
        }
      }
      break

    case "payment_intent.succeeded":
      console.log("[v0] Payment succeeded:", event.data.object.id)
      break

    case "payment_intent.payment_failed":
      console.log("[v0] Payment failed:", event.data.object.id)
      break

    default:
      console.log("[v0] Unhandled event type:", event.type)
  }

  return NextResponse.json({ received: true })
}
