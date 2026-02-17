export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 pt-20 pb-32 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="text-lg text-slate-400">
          Have questions? Our team (and our AI) is here to help.
        </p>
      </div>

      <div className="card bg-slate-900/50 border border-slate-800 p-8 shadow-2xl">
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label"><span className="label-text text-slate-400">Full Name</span></label>
              <input type="text" placeholder="John Doe" className="input input-bordered bg-slate-800 border-slate-700" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-slate-400">Email Address</span></label>
              <input type="email" placeholder="john@example.com" className="input input-bordered bg-slate-800 border-slate-700" />
            </div>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-slate-400">Subject</span></label>
            <select className="select select-bordered bg-slate-800 border-slate-700">
              <option>General Inquiry</option>
              <option>Sales</option>
              <option>Support</option>
              <option>Partnerships</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-slate-400">Message</span></label>
            <textarea className="textarea textarea-bordered h-32 bg-slate-800 border-slate-700" placeholder="How can we help you?"></textarea>
          </div>
          <button className="btn btn-primary btn-block rounded-xl">Send Message</button>
        </form>
      </div>
    </main>
  );
}
