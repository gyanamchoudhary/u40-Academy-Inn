import { BedDouble, BookOpen, ShieldCheck, Soup, UserRoundCheck, Wifi } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

const essentials = [
  { icon: BedDouble, title: "Supervised residence", text: "Comfortable accommodation with resident staff and a predictable daily routine." },
  { icon: BookOpen, title: "Dedicated study time", text: "Morning and evening study blocks with teacher support and doubt clearing." },
  { icon: Soup, title: "Fresh daily meals", text: "Balanced, home-style food, safe drinking water and regular non-vegetarian meals." },
  { icon: UserRoundCheck, title: "Individual attention", text: "Attendance, academic progress, wellbeing and behaviour are monitored personally." },
  { icon: ShieldCheck, title: "Safe environment", text: "A boys-only, substance-free campus with clear standards and guardian communication." },
  { icon: Wifi, title: "Learning facilities", text: "Smart classrooms, guided internet access, printed materials and science support." },
];

export function CampusLife() {
  return (
    <section id="hostel" className="bg-[#111318] py-24 text-white sm:py-32">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="page-grid gap-y-12">
          <div className="col-span-12 lg:col-span-5"><SectionHeading dark eyebrow="Life on campus" title="Everything students need. Nothing that distracts them." description="The residential environment is designed around safety, focus and sustainable study habits—not just accommodation." /></div>
          <div className="col-span-12 overflow-hidden lg:col-span-7"><img src="/assets/u40-campus-study-v2.png" alt="Students studying together with guidance from a resident teacher" className="aspect-[16/10] h-full w-full object-cover" loading="lazy" width="1536" height="960" /></div>
        </div>

        <div className="mt-16 grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-3">
          {essentials.map((item) => (
            <article key={item.title} className="border-b border-r border-white/15 p-7 sm:p-8">
              <item.icon className="h-6 w-6 text-[#d9f66f]" strokeWidth={1.6} />
              <h3 className="mt-8 text-xl font-bold tracking-[-0.025em]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{item.text}</p>
            </article>
          ))}
        </div>

        <div id="facilities" className="mt-14 flex flex-col gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-lg font-semibold">24-hour science teacher support · RO water · Wi-Fi · Smart classes · Regular counselling</p>
          <a href="#contact" className="inline-flex min-h-12 shrink-0 items-center justify-center bg-[#d9f66f] px-5 text-sm font-bold text-[#111318] transition hover:bg-white">Plan a campus visit</a>
        </div>
      </div>
    </section>
  );
}
