import { supabaseAdmin } from '@/lib/supabase-admin';
import { uploadContract } from '../../actions/upload-contract';
import { updateMerchantSettings } from '../../actions/merchant-settings';
import { addDebtor } from '../../actions/add-debtor';
import { revalidatePath } from 'next/cache';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import MobileBottomBar from '@/components/dashboard/MobileBottomBar';
import DashboardTopNav from '@/components/dashboard/DashboardTopNav';
import { getMerchantId } from '@/lib/auth';
import { createStripeConnectAccount } from '@/app/actions/stripe-connect';
import {
  Settings,
  FileText,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Users,
  BadgeDollarSign,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default async function DashboardPage() {
  const t = await getTranslations('Dashboard');
  const merchantId = await getMerchantId();

  if (!merchantId) {
     return <div>Unauthorized</div>;
  }

  const { data: merchant, error: merchantError } = await supabaseAdmin
    .from('merchants')
    .select('*')
    .eq('id', merchantId)
    .single();

  if (merchantError || !merchant) {
    return (
      <div className="p-10 bg-[#050505] min-h-screen text-white flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl">
          <ShieldCheck className="w-10 h-10 text-[#D4AF37]" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-widest">{t('notFound')}</h1>
          <p className="text-white/40 text-sm font-medium">
            {t('notFoundHint')} <code className="bg-white/5 px-2 py-0.5 rounded text-[#D4AF37]">seed.sql</code>
          </p>
        </div>
      </div>
    );
  }

  const hasStripe = !!merchant.stripe_account_id;

  const { data: contract } = await supabaseAdmin
    .from('contracts')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: debtors } = await supabaseAdmin
    .from('debtors')
    .select('*')
    .eq('merchant_id', merchantId);

  async function handleUpload(formData: FormData) {
    'use server';
    await uploadContract(formData);
    revalidatePath('/dashboard');
  }

  async function handleAddDebtor(formData: FormData) {
    'use server';
    await addDebtor(formData);
    revalidatePath('/[locale]/dashboard', 'page');
  }

  async function handleUpdateSettings(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const strictness = parseInt(formData.get('strictness') as string);
    const settlement = parseFloat(formData.get('settlement') as string) / 100;
    await updateMerchantSettings({
      name,
      strictness_level: strictness,
      settlement_floor: settlement,
    });
    revalidatePath('/dashboard');
  }

  const totalOutstanding = debtors?.reduce((acc, d) => acc + (d.status === 'pending' ? d.total_debt : 0), 0) || 0;
  const totalRecovered = debtors?.reduce((acc, d) => acc + (d.status === 'paid' ? d.total_debt : 0), 0) || 0;

  return (
    <div id="top" className="bg-[#050505] min-h-screen text-white selection:bg-[#D4AF37] selection:text-black pb-24 md:pb-12 relative overflow-x-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#6419E6]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Nav */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-xl flex items-center justify-center font-bold text-[#D4AF37] shadow-2xl relative transition-all group-hover:scale-110 group-hover:border-[#D4AF37]/30">
               <div className="absolute inset-0 bg-[#D4AF37]/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
               <span className="relative z-10 text-xs font-black">DRGN</span>
            </div>
            <h1 className="text-xl font-black tracking-[0.15em] uppercase hidden sm:block">DRAGUN<span className="text-[#D4AF37]">.</span></h1>
          </Link>
          <DashboardTopNav merchantName={merchant.name} hasStripe={hasStripe} />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16 relative z-10">
        {/* Stripe Onboarding Alert */}
        {!hasStripe && (
          <div className="relative group p-[1px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-amber-500/50 to-transparent">
             <div className="bg-[#0a0a0a] rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 animate-pulse border border-amber-500/20">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">Activate Gateway</h3>
                  <p className="text-white/40 text-sm font-medium max-w-md leading-relaxed">Connect your Stripe account to enable Meziani AI to recover funds directly into your balance. A 5% platform fee applies to all recovered debts.</p>
                </div>
              </div>
              <form action={createStripeConnectAccount}>
                <button className="w-full md:w-auto bg-[#D4AF37] hover:bg-white text-black font-black text-xs px-10 py-5 rounded-2xl transition-all shadow-2xl uppercase tracking-widest flex items-center justify-center group/btn">
                  Setup Stripe Connect
                  <ArrowRight className="w-4 h-4 ml-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#D4AF37] mb-2">
             <div className="h-px w-8 bg-[#D4AF37]/50" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('overview')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">{t('title')}</h2>
          <p className="text-white/40 text-sm font-medium max-w-lg">{t('subtitle')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: t('outstanding'), value: `$${totalOutstanding.toLocaleString()}`, icon: BadgeDollarSign, trend: '+4.5%', sub: t('momChange'), color: '#D4AF37' },
            { label: t('recovered'), value: `$${totalRecovered.toLocaleString()}`, icon: TrendingUp, trend: '+12%', sub: t('vsAvg'), color: '#10b981' },
            { label: t('activeChats'), value: debtors?.length || 0, icon: MessageSquare, trend: '87%', sub: t('replyRate'), color: '#6419E6' },
            { label: t('avgSettle'), value: '82%', icon: CheckCircle2, trend: `MIN ${Math.round(merchant.settlement_floor * 100)}%`, sub: 'EFFICIENCY', color: '#3abff8' }
          ].map((stat, i) => (
            <div key={i} className="group relative bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 shadow-2xl overflow-hidden hover:bg-white/[0.05] transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="w-16 h-16" style={{ color: stat.color }} />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-white/30">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60 tracking-widest">{stat.trend}</span>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{stat.sub}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Config & Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-12">
            {/* Agent Control */}
            <div id="settings" className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
              <div className="p-8 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
                      <Settings className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-white">{t('agentParams')}</h2>
                  </div>
                </div>

                <form action={handleUpdateSettings} className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Business Name (Statement Descriptor)</label>
                    <input 
                      type="text" 
                      name="name" 
                      defaultValue={merchant.name} 
                      placeholder="e.g. Venice Gym"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-[#D4AF37] focus:outline-none transition-all"
                    />
                    <p className="text-[9px] text-white/20 font-medium">This name will appear on the debtor's bank statement.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">{t('strictnessLabel')}</label>
                      <span className="text-2xl font-black text-[#D4AF37]">{merchant.strictness_level}<span className="text-xs opacity-20 ml-1">/10</span></span>
                    </div>
                    <input type="range" name="strictness" min="1" max="10" defaultValue={merchant.strictness_level} className="range range-xs appearance-none bg-white/5 h-1.5 rounded-full accent-[#D4AF37] cursor-pointer" />
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/20">
                      <span>{t('empathetic')}</span>
                      <span>{t('legalistic')}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">{t('settlementFloor')}</label>
                      <span className="text-2xl font-black text-white">{Math.round(merchant.settlement_floor * 100)}<span className="text-xs opacity-20 ml-1">%</span></span>
                    </div>
                    <input type="range" name="settlement" min="50" max="100" defaultValue={merchant.settlement_floor * 100} className="range range-xs appearance-none bg-white/5 h-1.5 rounded-full accent-white cursor-pointer" />
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/20">
                      <span>{t('flexible')}</span>
                      <span>{t('fixed')}</span>
                    </div>
                  </div>

                  <button className="w-full bg-white text-black hover:bg-[#D4AF37] hover:text-black font-black text-xs py-4 rounded-2xl transition-all active:scale-[0.98] shadow-xl uppercase tracking-[0.2em]">
                    {t('applyUpdates')}
                  </button>
                </form>
              </div>
            </div>

            {/* Knowledge Base */}
            <div id="knowledge" className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 border border-white/10">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-white">{t('ragContext')}</h2>
                  </div>
                  {contract && (
                    <div className="px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-[9px] font-black tracking-widest uppercase">
                      {t('active')}
                    </div>
                  )}
                </div>

                <form action={handleUpload} className="space-y-5">
                  <div className="relative group">
                    <input type="file" name="contract" accept=".pdf" className="hidden" id="contract-upload" />
                    <label htmlFor="contract-upload" className="w-full h-32 border-2 border-dashed border-white/10 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 hover:border-[#D4AF37]/50 hover:bg-white/[0.02] transition-all cursor-pointer group/label">
                       <Plus className="w-6 h-6 text-white/20 group-hover/label:text-[#D4AF37] transition-colors" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover/label:text-white transition-colors">{t('replacePDF')}</span>
                    </label>
                  </div>
                  <button className="w-full bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white font-black text-[10px] py-4 rounded-2xl transition-all uppercase tracking-[0.2em]">
                    EXECUTE INDEXING
                  </button>
                </form>
                {contract && (
                  <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                    <p className="text-[9px] text-white/20 uppercase font-black tracking-widest mb-1">{t('currentFile')}</p>
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3 text-[#D4AF37]" />
                      <p className="text-[11px] text-white/60 truncate font-bold font-mono uppercase tracking-tighter">{contract.file_name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pipeline */}
          <div id="debtors" className="lg:col-span-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl min-h-[600px] flex flex-col">
              <div className="p-8 md:p-10 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/[0.01]">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6419E6]/10 rounded-xl flex items-center justify-center text-[#6419E6] border border-[#6419E6]/20">
                      <Users className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">{t('activeRecoveries')}</h2>
                  </div>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] ml-13">SECURE PROTOCOL ACTIVE</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all">{t('filter')}</button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{t('debtorDetails')}</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hidden md:table-cell">{t('exposure')}</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{t('agentStatus')}</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-right">{t('protocol')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {debtors?.map(d => (
                      <tr key={d.id} className="group hover:bg-white/[0.02] transition-all">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                            <div className="relative">
                              <div className="absolute inset-0 bg-white/10 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="w-14 h-14 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl relative z-10 overflow-hidden">
                                <span className="text-sm font-black text-[#D4AF37]">{d.name[0].toUpperCase()}</span>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-[#0a0a0a] rounded-full" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="font-black text-white text-sm uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">{d.name}</div>
                              <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{d.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-8 hidden md:table-cell">
                          <div className="font-black text-base text-white tracking-tight">{d.currency} {d.total_debt.toLocaleString()}</div>
                          <div className="text-[9px] text-[#F87272] font-black uppercase tracking-widest mt-1">{t('daysPastDue').toUpperCase()}</div>
                        </td>
                        <td className="px-6 py-8">
                          <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            d.status === 'pending' 
                              ? 'bg-[#FBBD23]/5 border-[#FBBD23]/20 text-[#FBBD23]' 
                              : 'bg-[#10b981]/5 border-[#10b981]/20 text-[#10b981]'
                          }`}>
                            <div className={`w-1 h-1 rounded-full mr-2 animate-pulse ${d.status === 'pending' ? 'bg-[#FBBD23]' : 'bg-[#10b981]'}`} />
                            {d.status === 'pending' ? t('negotiating') : t('settled')}
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <Link
                            href={`/chat/${d.id}`}
                            className="inline-flex items-center gap-2 group/btn"
                          >
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover/btn:text-white transition-colors">{t('joinAI')}</span>
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover/btn:bg-[#D4AF37] group-hover/btn:text-black group-hover/btn:border-[#D4AF37] transition-all">
                              <ArrowUpRight className="w-4 h-4" />
                            </div>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {debtors?.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center text-white/10">
                    <Plus className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-black uppercase tracking-widest">{t('noRecoveries')}</p>
                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] max-w-[240px] mx-auto">{t('noRecoveriesHint')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Action Bar */}
      <MobileBottomBar addDebtorAction={handleAddDebtor} />

      {/* Luxury Brand Decoration */}
      <div className="fixed bottom-8 right-8 pointer-events-none opacity-20 hidden lg:block">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text text-white">WORLD CLASS RECOVERY • EST 2026</p>
      </div>
    </div>
  );
}
