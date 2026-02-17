export default function PricingPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Simple, <span className="text-primary">Transparent</span> Pricing
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Choose the plan that fits your business scale.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 pt-12">
        <div className="card bg-slate-900/50 border border-slate-800 p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold">Starter</h3>
            <p className="text-slate-400 text-sm">For small businesses</p>
          </div>
          <div className="text-4xl font-extrabold">$0<span className="text-lg font-normal text-slate-500">/mo</span></div>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2">✅ Up to 5 active debtors</li>
            <li className="flex items-center gap-2">✅ Standard AI model</li>
            <li className="flex items-center gap-2">✅ Email support</li>
          </ul>
          <button className="btn btn-outline btn-block rounded-xl">Get Started</button>
        </div>

        <div className="card bg-primary/10 border border-primary/50 p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-white text-[10px] px-3 py-1 font-bold uppercase tracking-widest rounded-bl-lg">Popular</div>
          <div>
            <h3 className="text-xl font-bold">Pro</h3>
            <p className="text-slate-400 text-sm">For growing gyms & studios</p>
          </div>
          <div className="text-4xl font-extrabold">$49<span className="text-lg font-normal text-slate-500">/mo</span></div>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2">✅ Unlimited active debtors</li>
            <li className="flex items-center gap-2">✅ Gemini 2.0 Flash (Fastest)</li>
            <li className="flex items-center gap-2">✅ Priority support</li>
            <li className="flex items-center gap-2">✅ Contract Knowledge Base</li>
          </ul>
          <button className="btn btn-primary btn-block rounded-xl shadow-lg shadow-primary/20">Go Pro</button>
        </div>

        <div className="card bg-slate-900/50 border border-slate-800 p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold">Enterprise</h3>
            <p className="text-slate-400 text-sm">For large debt portfolios</p>
          </div>
          <div className="text-4xl font-extrabold">Custom</div>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2">✅ Dedicated instance</li>
            <li className="flex items-center gap-2">✅ Custom AI training</li>
            <li className="flex items-center gap-2">✅ Legal firm integration</li>
            <li className="flex items-center gap-2">✅ API Access</li>
          </ul>
          <button className="btn btn-outline btn-block rounded-xl">Contact Sales</button>
        </div>
      </div>
    </main>
  );
}
