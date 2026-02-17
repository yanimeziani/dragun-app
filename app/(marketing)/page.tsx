import Link from 'next/link';
import { ArrowRight, Bot, ShieldCheck, Zap, BarChart3, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* 2027 Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-md text-slate-300 text-[10px] font-bold tracking-widest uppercase mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Agentic Recovery v2.7
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
          RECOVER DEBT <br />
          <span className="italic font-serif">WITH EMPATHY.</span>
        </h1>
        
        <p className="text-base md:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
          The first AI agent that negotiates like a human, cites like a lawyer, and settles like a pro. Built on Gemini 2.0 Flash for sub-second resolution.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/dashboard" className="btn btn-primary h-14 px-8 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)] text-base group">
            Launch Agent
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/about" className="btn btn-ghost h-14 px-8 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm text-base">
            How it works
          </Link>
        </div>

        {/* Bento Grid Preview (2027 Style) */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-12 gap-4 w-full max-w-6xl">
          {/* Main Agent Interface */}
          <div className="md:col-span-8 group relative rounded-3xl border border-slate-800 bg-slate-950/50 backdrop-blur-xl p-1 overflow-hidden transition-all hover:border-primary/50">
            <div className="bg-slate-900/50 rounded-[1.4rem] p-6 h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">🐲</div>
                  <div>
                    <div className="text-sm font-bold text-white uppercase tracking-tighter">Dragun Agent</div>
                    <div className="text-[10px] text-success font-medium flex items-center gap-1">
                      <div className="w-1 h-1 bg-success rounded-full"></div> Analyzing Contract...
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                </div>
              </div>
              
              <div className="space-y-4 flex-1 overflow-hidden">
                <div className="chat chat-start">
                  <div className="chat-bubble bg-slate-800/50 border border-slate-700 text-xs">I understand things are tight. However, your contract signed on Jan 12th states a 30-day notice...</div>
                </div>
                <div className="chat chat-end animate-pulse">
                  <div className="chat-bubble bg-primary text-xs shadow-lg shadow-primary/20">Can I pay half now and half Friday?</div>
                </div>
                <div className="chat chat-start">
                  <div className="chat-bubble bg-slate-800/50 border border-slate-700 text-xs">I can approve a 50% split if we schedule the second payment now. Does that help?</div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-2">
                <div className="h-8 flex-1 bg-slate-800/50 rounded-lg border border-slate-700"></div>
                <div className="h-8 w-8 bg-primary rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Side Stats */}
          <div className="md:col-span-4 grid grid-cols-1 gap-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between group hover:bg-slate-900/60 transition-colors">
              <Zap className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-3xl font-black text-white">82%</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Avg Recovery Rate</div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between group hover:bg-slate-900/60 transition-colors">
              <Bot className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-3xl font-black text-white">2.1s</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Response Latency</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Minimalist Section */}
      <section className="py-24 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Legal Compliance</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Built-in safeguards ensure every AI interaction follows FDCPA and local debt collection laws automatically.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Stripe Integrated</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Instant settlement links generated by the AI agent. Payment flows directly to your Stripe Connect account.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white">Bespoke Knowledge</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Drag-and-drop your PDFs. Our RAG engine indexes your specific terms so the AI never hallucinates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-b from-primary to-blue-700 p-12 md:p-24 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
            READY TO SCALE <br /> RECOVERY?
          </h2>
          <p className="text-primary-content/80 text-lg max-w-xl mx-auto">
            Join the elite merchants automating their back-office with Dragun.
          </p>
          <div className="pt-4">
            <Link href="/dashboard" className="btn bg-white text-primary border-none hover:bg-slate-100 h-16 px-12 rounded-2xl text-lg font-bold">
              Start Your Pilot
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
