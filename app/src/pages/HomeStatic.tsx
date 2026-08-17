import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Programs } from "@/sections/Programs";
import { CampusLife } from "@/sections/CampusLife";
import { FoodMenu } from "@/sections/FoodMenu";
import { Results } from "@/sections/Results";
import { Admissions } from "@/sections/Admissions";
import { Contact } from "@/sections/Contact";

export default function HomeStatic() {
  return (
    <div className="min-h-screen bg-[#f7f4ed] font-sans text-[#102235] antialiased">
      <div id="header-island">
        <Header />
      </div>
      <main id="main-content">
        <Hero />
        <About />
        <Programs />
        <div id="campus-life-island">
          <CampusLife />
        </div>
        <FoodMenu />
        <Results />
        <div id="admissions-island">
          <Admissions />
        </div>
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
