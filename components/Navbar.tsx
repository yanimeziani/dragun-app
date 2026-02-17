'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 px-6 py-4">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 rounded-2xl border border-white/5 bg-slate-950/50 backdrop-blur-xl shadow-2xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform">
            🐲
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">Dragun<span className="text-primary">.app</span></span>
        </Link>
        <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          <Link href="/features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
        <Link href="/dashboard" className="btn btn-primary btn-sm rounded-xl px-6 h-10 min-h-0 shadow-[0_0_15px_rgba(59,130,246,0.3)] border-none text-[11px] font-bold uppercase tracking-widest">
          Dashboard
        </Link>
      </nav>
    </div>
  );
}
