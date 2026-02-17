import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-primary selection:text-primary-content">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
