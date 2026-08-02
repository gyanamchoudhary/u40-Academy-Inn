import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { About } from "@/sections/About";
import { Admissions } from "@/sections/Admissions";
import { CampusLife } from "@/sections/CampusLife";
import { Contact } from "@/sections/Contact";
import { Hero } from "@/sections/Hero";
import { Programs } from "@/sections/Programs";
import { Results } from "@/sections/Results";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f4ed] font-sans text-[#102235] antialiased">
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Programs />
        <CampusLife />
        <Results />
        <Admissions />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
