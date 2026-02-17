'use client';

import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Debtor {
  id: string;
  merchant_id: string;
  name: string;
  currency: string;
  total_debt: number;
  merchant: {
    name: string;
    settlement_floor: number;
  };
}

export default function PaymentPage({ params }: { params: Promise<{ debtorId: string }> }) {
  const { debtorId } = use(params);
  const [debtor, setDebtor] = useState<Debtor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDebtor() {
      const { data } = await supabase
        .from('debtors')
        .select('*, merchant:merchants(*)')
        .eq('id', debtorId)
        .single();
      setDebtor(data);
      setLoading(false);
    }
    fetchDebtor();
  }, [debtorId]);

  const handlePayment = async (amount: number, description: string) => {
    if (!debtor) return;
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        debtorId,
        merchantId: debtor.merchant_id,
        amount,
        currency: debtor.currency,
        description,
      }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
  
  if (!debtor) return <div className="p-10 text-error bg-[#020617] min-h-screen text-center">Debtor not found.</div>;

  const fullDebt = debtor.total_debt;
  const settlementFloor = debtor.merchant.settlement_floor;
  const settlementAmount = fullDebt * Math.max(0.7, settlementFloor); // Offer 70% or floor

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-16 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="badge badge-outline border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-3">Settlement Portal</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Flexible <span className="text-primary">Settlement</span> Options
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            We understand situations change. Choose the resolution plan that works best for your current financial standing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {/* Full Payment */}
          <div className="card bg-slate-900/50 border border-slate-800 shadow-xl hover:border-primary/50 transition-all duration-300 group">
            <div className="card-body p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Pay in Full</h3>
                <p className="text-xs text-slate-500 mt-1">Resolve your account instantly.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{debtor.currency} {fullDebt.toLocaleString()}</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-400 flex-1">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Immediate account clearance
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Positive credit reporting
                </li>
              </ul>
              <button 
                onClick={() => handlePayment(fullDebt, 'Full Debt Payment')}
                className="btn btn-primary w-full rounded-xl border-none shadow-lg shadow-primary/20"
              >
                Pay Full Amount
              </button>
            </div>
          </div>

          {/* One-time Settlement (The "Scaleup" plan look) */}
          <div className="card bg-slate-900/80 border-2 border-primary shadow-[0_0_30px_rgba(59,130,246,0.15)] relative scale-105 z-10">
            <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-tighter">Recommended</div>
            <div className="card-body p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Lump Sum Settlement</h3>
                <p className="text-xs text-slate-400 mt-1">One-time payment at a discount.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{debtor.currency} {settlementAmount.toLocaleString()}</span>
                <span className="text-xs text-slate-500 line-through opacity-50">{fullDebt}</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 flex-1">
                <li className="flex items-center gap-2 font-bold">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Save {Math.round((1 - settlementAmount/fullDebt) * 100)}% on total balance
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Final resolution today
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  No further interest
                </li>
              </ul>
              <button 
                onClick={() => handlePayment(settlementAmount, 'One-time Settlement')}
                className="btn btn-primary w-full rounded-xl shadow-xl shadow-primary/30 border-none"
              >
                Accept Settlement
              </button>
            </div>
          </div>

          {/* Installment Plan */}
          <div className="card bg-slate-900/50 border border-slate-800 shadow-xl">
            <div className="card-body p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">3-Month Plan</h3>
                <p className="text-xs text-slate-500 mt-1">Split the balance over time.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{debtor.currency} {(fullDebt / 3).toLocaleString()}</span>
                <span className="text-xs text-slate-500">/mo</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-400 flex-1">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Manageable monthly payments
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  0% APR Interest
                </li>
              </ul>
              <button 
                onClick={() => handlePayment(fullDebt / 3, 'First Installment')}
                className="btn btn-accent btn-outline w-full rounded-xl"
              >
                Start Installments
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 text-center">
           <p className="text-xs text-slate-500">
             Secure payment processed via Stripe. By proceeding, you agree to the settlement terms. 
             Dragon.app acts as a recovery agent for <strong>{debtor.merchant.name}</strong>.
           </p>
        </div>
      </div>
    </div>
  );
}
