import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white text-slate-900">
      <Header />
      <main className="flex-1">
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
