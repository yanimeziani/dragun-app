'use client';

import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Debtor {
  name: string;
  email: string;
  merchant: {
    name: string;
  };
}

export default function SuccessPage({ params }: { params: Promise<{ debtorId: string }> }) {
  const { debtorId } = use(params);
  const [debtor, setDebtor] = useState<Debtor | null>(null);

  useEffect(() => {
    async function fetchDebtor() {
      const { data } = await supabase
        .from('debtors')
        .select('*, merchant:merchants(name)')
        .eq('id', debtorId)
        .single();
      setDebtor(data);
    }
    fetchDebtor();
  }, [debtorId]);

  if (!debtor) return <div className="p-10 text-center">Finalizing...</div>;

  return (
    <div className="flex flex-col h-screen bg-base-100 max-w-md mx-auto border-x shadow-2xl p-8 items-center justify-center space-y-6">
      <div className="w-24 h-24 bg-success text-success-content rounded-full flex items-center justify-center shadow-lg animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Settled!</h1>
        <p className="text-lg opacity-80">Thank you, {debtor.name}.</p>
        <p className="text-sm opacity-60">Your account with {debtor.merchant.name} has been successfully closed. A confirmation email will be sent to {debtor.email}.</p>
      </div>
      <div className="card bg-base-200 w-full shadow-inner p-4 text-center">
        <div className="text-xs uppercase font-bold opacity-40">Transaction ID</div>
        <div className="text-xs font-mono">DRGN-SETTLMT-{debtorId.slice(0, 8)}</div>
      </div>
      <button className="btn btn-primary btn-outline btn-sm w-full mt-4" onClick={() => window.location.href = '/'}>
        Return Home
      </button>
    </div>
  );
}
