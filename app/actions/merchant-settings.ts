'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';

export async function updateMerchantSettings(merchantId: string, settings: { strictness_level: number, settlement_floor: number }) {
  const { error } = await supabaseAdmin
    .from('merchants')
    .update(settings)
    .eq('id', merchantId);

  if (error) throw new Error(error.message);
  return { success: true };
}
