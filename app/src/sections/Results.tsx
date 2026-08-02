import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { resultCards } from "@/data/institute";

export function Results() {
  return (
    <section id="results" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <SectionHeading eyebrow="Outcomes" title="Results measured over years, not a single campaign." description="Since 2012, the academy has maintained consistent Higher Secondary outcomes while helping students progress into medical, engineering and other scientific fields." />

        <div className="mt-16 grid border-y border-black/15 sm:grid-cols-3">
          {[
            ["589", "Students admitted to Class XI", "2012–2025"],
            ["100%", "Higher Secondary pass rate", "Across all completed batches"],
            ["03", "NEET qualifiers in 2025", "West Bengal Medical Colleges"],
          ].map(([value, label, detail]) => (
            <div key={label} className="border-b border-black/15 py-8 sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0">
              <p className="text-6xl font-semibold tracking-[-0.06em] text-[#2046d8] sm:text-7xl">{value}</p>
              <p className="mt-5 text-base font-bold text-[#111318]">{label}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#6b7079]">{detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-12 bg-[#eef1ff] p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:p-14">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2046d8]">NEET · 2025</p>
            <h3 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.045em]">Three students. Three medical college journeys.</h3>
            <a href="#admissions" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#2046d8]">Begin your application <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="border-t border-black/15">
            {resultCards.map((student) => (
              <div key={student.name} className="grid gap-2 border-b border-black/15 py-5 sm:grid-cols-[0.8fr_1.2fr]">
                <p className="font-bold text-[#111318]">{student.name}</p><p className="text-sm leading-6 text-[#60646c]">{student.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
