'use server';

import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { redirect } from 'next/navigation';
import { ensureMerchant } from '@/lib/merchant';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

export async function createStripeConnectAccount() {
  const merchantId = await ensureMerchant();
  if (!merchantId) throw new Error('Unauthorized');

  // 1. Get current merchant data
  const { data: merchant, error: merchantError } = await supabaseAdmin
    .from('merchants')
    .select('*')
    .eq('id', merchantId)
    .single();

  if (merchantError || !merchant) {
    console.error('Merchant lookup error:', merchantError);
    throw new Error('Merchant profile initialization failed. Please try again.');
  }

  let accountId = merchant.stripe_account_id;

  // 2. Create Stripe account if it doesn't exist
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      email: merchant.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      settings: {
        payouts: {
          schedule: {
            interval: 'manual',
          },
        },
      },
    });
    accountId = account.id;

    // Save to DB
    await supabaseAdmin
      .from('merchants')
      .update({ stripe_account_id: accountId })
      .eq('id', merchantId);
  }

  // 3. Create Account Link for onboarding
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
    return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?stripe_success=true`,
    type: 'account_onboarding',
  });

  redirect(accountLink.url);
}

export async function createStripeLoginLink() {
  const merchantId = await ensureMerchant();
  if (!merchantId) throw new Error('Unauthorized');

  const { data: merchant, error: merchantError } = await supabaseAdmin
    .from('merchants')
    .select('stripe_account_id')
    .eq('id', merchantId)
    .single();

  if (merchantError || !merchant?.stripe_account_id) {
    console.error('Stripe Login Link Error:', merchantError);
    throw new Error('No Connect account found');
  }

  const loginLink = await stripe.accounts.createLoginLink(merchant.stripe_account_id);
  redirect(loginLink.url);
}
