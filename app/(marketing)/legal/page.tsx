export default function LegalPage() {
  const sections = [
    {
      title: "Privacy Policy",
      content: "At Dragun.app, we take your data and the data of your debtors seriously. All data is encrypted at rest and in transit. We comply with GDPR and CCPA standards."
    },
    {
      title: "Terms of Service",
      content: "By using Dragun.app, you agree to the following terms. We provide an AI-powered platform for debt recovery. Use of the platform must be within legal limits."
    },
    {
      title: "Debt Collection Compliance",
      content: "Dragun is designed to follow standard debt collection rules. Users are responsible for ensuring that the configuration of the AI (strictness level) matches local legal requirements."
    }
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 pt-20 pb-32 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Legal <span className="text-primary">Center</span>
        </h1>
        <p className="text-lg text-slate-400">
          Trust, transparency, and compliance.
        </p>
      </div>

      <div className="space-y-8 pt-12">
        {sections.map((section, i) => (
          <div key={i} className="card bg-slate-900/50 border border-slate-800 p-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            <p className="text-slate-400 leading-relaxed text-sm">{section.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
