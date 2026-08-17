import { Header } from "@/components/site/Header";
import { Hero } from "@/sections/Hero";

export default function HomeShell() {
  return (
    <div className="min-h-screen bg-[#f7f4ed] font-sans text-[#102235] antialiased">
      <div id="header-island">
        <Header />
      </div>
      <main id="main-content">
        <Hero />
        <div id="rest-island" />
      </main>
    </div>
  );
}
