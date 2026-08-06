import Hero from "@/components/landing/Hero";
import Benefits from "@/components/landing/Benefits";
import Stats from "@/components/landing/Stats";
import CtaFinal from "@/components/landing/CtaFinal";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Stats />
      <Benefits />
      <CtaFinal />
      <Footer />
    </main>
  );
}
