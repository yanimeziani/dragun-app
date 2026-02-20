'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Redirect to dashboard on success
  redirect('/dashboard');
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/api/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // Create merchant record
    const { error: merchantError } = await supabaseAdmin
      .from('merchants')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        name: data.user.email?.split('@')[0] || 'New Merchant',
      });
    
    if (merchantError) {
      console.error('Error creating merchant:', merchantError);
      // We don't necessarily want to fail sign up if merchant creation fails, 
      // but the user won't have a dashboard.
    }
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
