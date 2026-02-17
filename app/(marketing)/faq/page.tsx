export default function FAQPage() {
  const faqs = [
    {
      q: "How does the AI handle disputes?",
      a: "Dragun uses Gemini 2.0 Flash to understand the debtor's context. If they claim they've already paid or cancelled, the AI will search your uploaded contracts and payment history to provide a factual, empathetic response."
    },
    {
      q: "Is it legal?",
      a: "Yes. Dragun operates within the guidelines of debt collection practices, acting as an automated agent of your business. It maintains a professional and firm but fair tone at all times."
    },
    {
      q: "Can I customize the 'strictness'?",
      a: "Absolutely. Through your dashboard, you can adjust a slider from 'Soft Nudge' to 'Legal Firm' to match your brand's voice and urgency."
    },
    {
      q: "What payment methods are supported?",
      a: "We integrate directly with Stripe, allowing debtors to pay via Credit Card, Apple Pay, Google Pay, or ACH transfers directly in the chat."
    }
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 pt-20 pb-32 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Common <span className="text-primary">Questions</span>
        </h1>
        <p className="text-lg text-slate-400">
          Everything you need to know about the dragon behind the debt.
        </p>
      </div>

      <div className="space-y-4 pt-12">
        {faqs.map((faq, i) => (
          <div key={i} className="collapse collapse-plus bg-slate-900/50 border border-slate-800">
            <input type="radio" name="my-accordion-3" defaultChecked={i === 0} /> 
            <div className="collapse-title text-xl font-medium text-white">
              {faq.q}
            </div>
            <div className="collapse-content text-slate-400"> 
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
