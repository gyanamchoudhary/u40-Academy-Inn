import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

const pathways = [
  { level: "Foundation", classes: "Classes IX–X", title: "Build the base", text: "Concept clarity, board readiness and disciplined study habits for students beginning their science journey." },
  { level: "Senior secondary", classes: "Classes XI–XII", title: "Master the syllabus", text: "Integrated Higher Secondary Science learning with structured revision, assessments and individual support." },
  { level: "Medical", classes: "NEET", title: "Prepare for medicine", text: "Focused Biology, Physics and Chemistry preparation with chapter tests, practice and performance analysis." },
  { level: "Engineering", classes: "IIT-JEE · WBJEE", title: "Prepare for engineering", text: "Advanced analytical problem-solving, speed practice and exam-specific preparation across PCM subjects." },
];

export function Programs() {
  return (
    <section id="programs" className="bg-[#f7f6f2] py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="page-grid gap-y-8">
          <div className="col-span-12 lg:col-span-8"><SectionHeading eyebrow="Academic pathways" title="A clear route from foundation to competitive examinations." description="Students join at the stage that matches their current class and long-term goal. Every pathway shares the same residential support system." /></div>
          <div className="col-span-12 flex items-end lg:col-span-4 lg:justify-end"><a href="#admissions" className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#2046d8] px-5 text-sm font-bold text-white transition hover:bg-[#1737ae] active:bg-[#1737ae] sm:w-auto">Talk to an academic adviser <ArrowRight className="h-4 w-4" /></a></div>
        </div>

        <div className="mt-12 border-t border-black/15 sm:mt-16">
          {pathways.map((pathway, index) => (
            <article key={pathway.level} className="group grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-3 border-b border-black/15 py-7 transition hover:bg-white sm:grid-cols-[4rem_1fr_1.2fr_2fr] sm:gap-5 sm:px-5 sm:py-9">
              <span className="font-mono text-xs font-semibold text-[#2046d8]">0{index + 1}</span>
              <div><p className="text-lg font-bold tracking-[-0.02em]">{pathway.level}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#6b7079]">{pathway.classes}</p></div>
              <h3 className="col-start-2 text-2xl font-semibold tracking-[-0.035em] text-[#111318] sm:col-start-auto">{pathway.title}</h3>
              <p className="col-span-2 max-w-[52ch] text-sm leading-7 text-[#60646c] sm:col-span-1">{pathway.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 grid gap-px bg-black/15 border border-black/15 sm:grid-cols-3">
          {["Printed notes + question banks", "Weekly tests + analysis", "Daily doubt clearing + mentoring"].map((item) => <div key={item} className="bg-white p-6 text-sm font-semibold text-[#33373f]">{item}</div>)}
        </div>
      </div>
    </section>
  );
}
