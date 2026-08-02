import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

const principles = [
  ["01", "Learn deeply", "Strong concepts before shortcuts. Every lesson connects board learning with entrance-level problem solving."],
  ["02", "Practice consistently", "A clear daily rhythm of classes, self-study, tests, revision and doubt clearing."],
  ["03", "Live responsibly", "Supervised residential life that builds independence, respect, wellbeing and disciplined habits."],
];

export function About() {
  return (
    <section id="about" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="page-grid gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <SectionHeading eyebrow="Why U40" title="Education works best when the whole day has direction." description="Our campus brings teaching, practice, residence and mentorship into one coherent routine—so students can focus on learning without managing multiple systems." />
            <a href="#hostel" className="mt-8 inline-flex items-center gap-2 border-b border-[#2046d8] pb-2 text-sm font-bold text-[#2046d8] transition hover:text-[#1737ae]">See campus life <ArrowUpRight className="h-4 w-4" /></a>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:pl-10">
            {principles.map(([number, title, text]) => (
              <article key={number} className="grid gap-4 border-t border-black/15 py-7 sm:grid-cols-[4rem_1fr_1.5fr] sm:items-start">
                <span className="font-mono text-xs font-semibold text-[#2046d8]">{number}</span>
                <h3 className="text-xl font-bold tracking-[-0.025em] text-[#111318]">{title}</h3>
                <p className="text-sm leading-7 text-[#60646c]">{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-20 grid overflow-hidden bg-[#111318] lg:grid-cols-[1.2fr_0.8fr]">
          <img src="/assets/u40-science-lab-v2.png" alt="Science students conducting laboratory work under teacher supervision" className="h-full min-h-[24rem] w-full object-cover" loading="lazy" width="1536" height="1024" />
          <div className="flex flex-col justify-between p-8 text-white sm:p-12">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d9f66f]">The U40 model</p>
            <blockquote className="mt-16 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">“One campus. One routine. Complete attention on the student.”</blockquote>
            <p className="mt-8 text-sm leading-7 text-white/60">Academic guidance, meals, accommodation and pastoral care are coordinated by one resident team.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
