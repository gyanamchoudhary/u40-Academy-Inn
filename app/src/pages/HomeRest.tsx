import { Footer } from "@/components/site/Footer";
import { About } from "@/sections/About";
import { Programs } from "@/sections/Programs";
import { CampusLife } from "@/sections/CampusLife";
import { FoodMenu } from "@/sections/FoodMenu";
import { Results } from "@/sections/Results";
import { Admissions } from "@/sections/Admissions";
import { Contact } from "@/sections/Contact";

export function HomeRest() {
  return (
    <>
      <About />
      <Programs />
      <CampusLife />
      <FoodMenu />
      <Results />
      <Admissions />
      <Contact />
      <Footer />
    </>
  );
}
