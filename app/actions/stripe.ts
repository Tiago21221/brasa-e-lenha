"use server"

import { stripe } from "@/lib/stripe"

export async function createCheckoutSession(orderData: {
  customerName: string
  customerPhone: string
  customerAddress: string
  notes?: string
  items: Array<{
    productId: number
    name: string
    price: number
    quantity: number
  }>
  totalCents: number
}) {
  try {
    // Create line items for Stripe
    const lineItems = orderData.items.map((item) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }))

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      redirect_on_completion: "never",
      line_items: lineItems,
      mode: "payment",
      metadata: {
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerAddress: orderData.customerAddress,
        notes: orderData.notes || "",
      },
    })

    return { clientSecret: session.client_secret }
  } catch (error) {
    console.error("[v0] Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

export async function getSessionStatus(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return {
      status: session.status,
      customerEmail: session.customer_details?.email,
      paymentStatus: session.payment_status,
    }
  } catch (error) {
    console.error("[v0] Error retrieving session:", error)
    throw new Error("Failed to retrieve session status")
  }
}
