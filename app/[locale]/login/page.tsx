'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { signIn } from '@/app/actions/auth';
import { Link } from '@/i18n/navigation';
import { ChevronRight, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signIn(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#6419E6]/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]"></div>
      </div>

      <div className="w-full max-w-[400px] z-10">
        {/* Logo/Brand Area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 mb-6 shadow-2xl relative group">
             <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <span className="relative z-10 text-[10px] font-black text-[#D4AF37]">DRGN</span>
          </div>
          <h1 className="text-3xl font-black tracking-[0.2em] text-white mb-2 uppercase">
            DRAGUN<span className="text-[#D4AF37]">.</span>
          </h1>
          <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase">
            {t('signIn')} TO YOUR EMPIRE
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl mb-6 text-center animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">
                {t('email')}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#D4AF37] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  className="w-full bg-white/[0.05] border border-white/5 text-white placeholder:text-white/20 text-sm rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#D4AF37]/50 focus:bg-white/[0.08] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">
                {t('password')}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#D4AF37] transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-white/[0.05] border border-white/5 text-white placeholder:text-white/20 text-sm rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#D4AF37]/50 focus:bg-white/[0.08] transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-[#D4AF37] hover:text-black font-bold text-sm py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-xl flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  {t('signIn').toUpperCase()}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-white/30 text-xs mb-4">
              {t('noAccount')}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center text-[#D4AF37] hover:text-white text-sm font-bold transition-colors group"
            >
              {t('signUp').toUpperCase()}
              <div className="ml-2 w-5 h-[1px] bg-[#D4AF37] group-hover:bg-white group-hover:w-8 transition-all" />
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center opacity-20 hover:opacity-100 transition-opacity duration-700">
          <p className="text-[10px] tracking-[0.3em] text-white uppercase font-bold">
            © 2026 DRAGUN TECHNOLOGIES • LUXURY RECOVERY
          </p>
        </div>
      </div>
    </div>
  );
}
