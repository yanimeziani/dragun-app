import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

export async function POST(req: Request) {
  const { debtorId, amount, currency = 'usd' } = await req.json();

  const { data: debtor } = await supabaseAdmin
    .from('debtors')
    .select('*, merchant:merchants(name)')
    .eq('id', debtorId)
    .single();

  if (!debtor) {
    return new Response('Debtor not found', { status: 404 });
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: `Debt Settlement - ${debtor.merchant.name}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/pay/${debtorId}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/chat/${debtorId}`,
    metadata: {
      debtor_id: debtorId,
      merchant_id: debtor.merchant_id,
    },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
