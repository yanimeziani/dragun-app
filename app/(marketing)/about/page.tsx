export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 pt-20 pb-32 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          Our <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Mission</span>
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          At Dragun.app, we believe debt recovery doesn&apos;t have to be a battle. By combining Gemini 2.0 Flash&apos;s sub-second intelligence with an empathetic, human-centered approach, we help businesses recover lost revenue while maintaining customer relationships.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-12">
        <div className="card bg-slate-900/50 border border-slate-800 p-8 space-y-4">
          <h3 className="text-xl font-bold text-white">Built for Speed</h3>
          <p className="text-slate-400 text-sm">We leverage the latest Vercel Edge Functions and Gemini 2.0 Flash to ensure every interaction is instant.</p>
        </div>
        <div className="card bg-slate-900/50 border border-slate-800 p-8 space-y-4">
          <h3 className="text-xl font-bold text-white">Founded in 2026</h3>
          <p className="text-slate-400 text-sm">Born in the era of Agentic AI, Dragun is built from the ground up to be more than just a chatbot—it&apos;s a specialist.</p>
        </div>
      </div>
    </main>
  );
}
