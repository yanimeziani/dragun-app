export default function FeaturesPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Advanced <span className="text-primary">Features</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Everything you need to automate your debt recovery with empathy and efficiency.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 pt-12">
        <div className="card bg-slate-900/50 border border-slate-800 p-6 space-y-4">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">🤖</div>
          <h3 className="text-xl font-bold">Gemini 2.0 Powered</h3>
          <p className="text-slate-400 text-sm">Real-time, context-aware negotiations using the latest AI technology.</p>
        </div>
        <div className="card bg-slate-900/50 border border-slate-800 p-6 space-y-4">
          <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-2xl">📄</div>
          <h3 className="text-xl font-bold">Contract Analysis</h3>
          <p className="text-slate-400 text-sm">Upload your contracts and let the AI cite specific clauses during recovery.</p>
        </div>
        <div className="card bg-slate-900/50 border border-slate-800 p-6 space-y-4">
          <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center text-2xl">💰</div>
          <h3 className="text-xl font-bold">Stripe Integration</h3>
          <p className="text-slate-400 text-sm">Seamless payment processing directly through the chat interface.</p>
        </div>
      </div>
    </main>
  );
}
