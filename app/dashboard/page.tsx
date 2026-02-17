import { supabaseAdmin } from '@/lib/supabase-admin';
import { uploadContract } from '../actions/upload-contract';
import { updateMerchantSettings } from '../actions/merchant-settings';
import { revalidatePath } from 'next/cache';

// In a real app, this would come from the session. For this MVP, we use the seeded merchant.
const DUMMY_MERCHANT_ID = '00000000-0000-0000-0000-000000000001';

export default async function DashboardPage() {
  const { data: merchant, error: merchantError } = await supabaseAdmin
    .from('merchants')
    .select('*')
    .eq('id', DUMMY_MERCHANT_ID)
    .single();

  if (merchantError || !merchant) {
    return (
      <div className="p-10 bg-[#020617] min-h-screen text-slate-200 flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h1 className="text-xl font-bold text-center">Merchant data not found</h1>
        <p className="text-slate-500 text-sm max-w-xs text-center">
          Please ensure you have run the <code className="bg-slate-800 px-1 rounded">seed.sql</code> in your Supabase SQL editor.
        </p>
      </div>
    );
  }

  const { data: contract } = await supabaseAdmin
    .from('contracts')
    .select('*')
    .eq('merchant_id', DUMMY_MERCHANT_ID)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: debtors } = await supabaseAdmin
    .from('debtors')
    .select('*')
    .eq('merchant_id', DUMMY_MERCHANT_ID);

  async function handleUpload(formData: FormData) {
    'use server';
    await uploadContract(DUMMY_MERCHANT_ID, formData);
    revalidatePath('/dashboard');
  }

  async function handleUpdateSettings(formData: FormData) {
    'use server';
    const strictness = parseInt(formData.get('strictness') as string);
    const settlement = parseFloat(formData.get('settlement') as string) / 100;
    
    await updateMerchantSettings(DUMMY_MERCHANT_ID, {
      strictness_level: strictness,
      settlement_floor: settlement,
    });
    revalidatePath('/dashboard');
  }

  if (!merchant) return <div className="p-10 bg-[#020617] min-h-screen text-slate-200">Merchant not found. Run seed.sql in Supabase.</div>;

  const totalOutstanding = debtors?.reduce((acc, d) => acc + (d.status === 'pending' ? d.total_debt : 0), 0) || 0;
  const totalRecovered = debtors?.reduce((acc, d) => acc + (d.status === 'paid' ? d.total_debt : 0), 0) || 0;

  return (
    <div className="bg-[#020617] min-h-screen text-slate-200 selection:bg-primary selection:text-primary-content">
      {/* Top Nav */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] text-xs">🐲</div>
             <h1 className="text-xl font-bold tracking-tight hidden md:block">Dragun Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="badge badge-outline border-slate-700 text-slate-400 text-xs py-3 px-4">Merchant: {merchant.name}</div>
             <div className="avatar placeholder">
               <div className="bg-slate-800 text-slate-400 rounded-full w-8">
                 <span className="text-xs">JD</span>
               </div>
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-slate-900/50 border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="card-body p-6">
               <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Total Outstanding</p>
               <h3 className="text-3xl font-bold text-white mt-1">${totalOutstanding.toLocaleString()}</h3>
               <div className="flex items-center gap-1 text-xs text-error mt-2">
                 <span>↑ 4.5%</span>
                 <span className="opacity-50">from last month</span>
               </div>
            </div>
          </div>

          <div className="card bg-slate-900/50 border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-success"></div>
            <div className="card-body p-6">
               <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Recovered Today</p>
               <h3 className="text-3xl font-bold text-white mt-1">${totalRecovered.toLocaleString()}</h3>
               <div className="flex items-center gap-1 text-xs text-success mt-2">
                 <span>↑ 12.3%</span>
                 <span className="opacity-50">vs average</span>
               </div>
            </div>
          </div>

          <div className="card bg-slate-900/50 border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
            <div className="card-body p-6">
               <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Active Conversations</p>
               <h3 className="text-3xl font-bold text-white mt-1">{debtors?.length || 0}</h3>
               <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                 <span>87%</span>
                 <span className="opacity-50">Response rate</span>
               </div>
            </div>
          </div>

          <div className="card bg-slate-900/50 border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <div className="card-body p-6">
               <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Avg Settlement</p>
               <h3 className="text-3xl font-bold text-white mt-1">82%</h3>
               <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                 <span>Floor: {merchant.settlement_floor * 100}%</span>
               </div>
            </div>
          </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            {/* Agent Control */}
            <div className="card bg-[#0f172a] border border-slate-800 shadow-2xl">
              <div className="card-body">
                <h2 className="card-title text-white mb-4">Agent AI Control</h2>
                <form action={handleUpdateSettings} className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-slate-400">Recovery Strictness</span>
                      <span className="label-text-alt font-bold text-primary">{merchant.strictness_level}/10</span>
                    </label>
                    <input 
                      type="range" 
                      name="strictness" 
                      min="1" max="10" 
                      defaultValue={merchant.strictness_level} 
                      className="range range-primary range-xs" 
                    />
                    <div className="flex justify-between text-[10px] uppercase tracking-tighter opacity-40 mt-2">
                      <span>Nudge</span>
                      <span>Legal Firm</span>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-slate-400">Settlement Floor</span>
                      <span className="label-text-alt font-bold text-accent">{Math.round(merchant.settlement_floor * 100)}%</span>
                    </label>
                    <input 
                      type="range" 
                      name="settlement" 
                      min="50" max="100" 
                      defaultValue={merchant.settlement_floor * 100} 
                      className="range range-accent range-xs" 
                    />
                  </div>
                  <button className="btn btn-primary btn-sm w-full rounded-lg shadow-lg shadow-primary/20 border-none mt-4">Save & Update AI</button>
                </form>
              </div>
            </div>

            {/* Knowledge Base */}
            <div className="card bg-[#0f172a] border border-slate-800 shadow-2xl">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="card-title text-white">Knowledge Base</h2>
                    <p className="text-xs opacity-50">Upload policy PDFs or contracts.</p>
                  </div>
                  {contract && <div className="badge badge-success badge-xs">Active</div>}
                </div>
                
                <form action={handleUpload} className="space-y-4">
                  <input type="file" name="contract" accept=".pdf" className="file-input file-input-bordered file-input-sm w-full bg-slate-900 border-slate-700" />
                  <button className="btn btn-outline btn-sm w-full rounded-lg">Update Contract</button>
                </form>
                {contract && (
                  <div className="text-[10px] opacity-40 mt-2 truncate">
                    Currently indexing: {contract.file_name}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="card bg-[#0f172a] border border-slate-800 shadow-2xl h-full">
               <div className="card-body p-0">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="card-title text-white font-bold">Recovery Pipeline</h2>
                    <button className="btn btn-ghost btn-xs">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full text-slate-300">
                      <thead>
                        <tr className="border-slate-800 text-slate-500 uppercase text-[10px] tracking-widest">
                          <th className="bg-transparent">Debtor</th>
                          <th className="bg-transparent">Balance</th>
                          <th className="bg-transparent">Agent Status</th>
                          <th className="bg-transparent text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {debtors?.map(d => (
                          <tr key={d.id} className="border-slate-800 hover:bg-slate-800/20 transition-colors">
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="avatar placeholder">
                                  <div className="bg-slate-800 text-slate-500 rounded-lg w-10">
                                    <span className="text-xs font-bold">{d.name[0]}</span>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-bold text-white text-sm">{d.name}</div>
                                  <div className="text-[10px] opacity-40">{d.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="font-medium text-sm">{d.currency} {d.total_debt.toLocaleString()}</div>
                            </td>
                            <td>
                              <div className={`badge badge-sm ${d.status === 'pending' ? 'badge-warning' : 'badge-success'} border-none text-[10px] font-bold`}>
                                {d.status === 'pending' ? 'Recovering' : 'Settled'}
                              </div>
                            </td>
                            <td className="text-right">
                              <a href={`/chat/${d.id}`} className="btn btn-primary btn-outline btn-xs rounded-lg px-4 hover:btn-primary">Open Chat</a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
