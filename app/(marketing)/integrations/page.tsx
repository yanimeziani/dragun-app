export default function IntegrationsPage() {
  const integrations = [
    {
      name: "Stripe",
      description: "Embed checkout sessions and handle payment directly in the chat.",
      status: "Active",
      icon: "💳"
    },
    {
      name: "Supabase",
      description: "Real-time updates to your recovery pipeline via Postgres triggers.",
      status: "Active",
      icon: "⚡"
    },
    {
      name: "Gemini 2.0 Flash",
      description: "Sub-second AI intelligence with 1M token context window.",
      status: "Active",
      icon: "🐉"
    },
    {
      name: "Mindbody (Gym Management)",
      description: "Direct sync of outstanding memberships and debtors.",
      status: "Upcoming",
      icon: "🧘"
    }
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Seamless <span className="text-primary">Integrations</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Connect your existing tools to Dragun for a fully automated recovery experience.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
        {integrations.map((integration, i) => (
          <div key={i} className="card bg-slate-900/50 border border-slate-800 p-6 space-y-4 relative overflow-hidden">
             {integration.status === 'Upcoming' && <div className="absolute top-0 right-0 bg-accent/20 text-accent text-[8px] px-2 py-1 font-bold uppercase tracking-widest rounded-bl-lg">Upcoming</div>}
             <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">{integration.icon}</div>
             <h3 className="text-xl font-bold text-white">{integration.name}</h3>
             <p className="text-slate-400 text-xs leading-relaxed">{integration.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
