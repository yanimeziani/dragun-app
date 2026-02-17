import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="px-6 py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center font-bold text-white shadow-lg">🐲</div>
            <span className="text-xl font-bold tracking-tighter text-white">Dragun<span className="text-primary">.app</span></span>
          </div>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
            The standard for modern, empathetic debt recovery. Leveraging agentic AI to resolve balances with human-grade intuition.
          </p>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            © 2027 Dragun Technologies Inc.
          </div>
        </div> 
        <div className="space-y-4">
          <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Platform</h6> 
          <div className="flex flex-col gap-3 text-sm text-slate-500 font-medium">
            <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="/integrations" className="hover:text-primary transition-colors">Integrations</Link>
          </div>
        </div> 
        <div className="space-y-4">
          <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Company</h6> 
          <div className="flex flex-col gap-3 text-sm text-slate-500 font-medium">
            <Link href="/about" className="hover:text-primary transition-colors">About us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/legal" className="hover:text-primary transition-colors">Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
