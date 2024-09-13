import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
const Public_url = "https://fuzzie.onrender.com";
export async function GET(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    typescript: true,
    apiVersion: "2023-10-16",
  });

  const products = await stripe.prices.list({
    limit: 3,
  });

  return NextResponse.json(products.data);
}

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    typescript: true,
    apiVersion: "2023-10-16",
  });
  const data = await req.json();
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: data.priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${Public_url}/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${Public_url}/billing`,
  });
  return NextResponse.json(session.url);
}
