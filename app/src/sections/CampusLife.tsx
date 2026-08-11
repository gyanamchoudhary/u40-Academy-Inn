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
          <div className="col-span-12 grid min-h-[34rem] grid-cols-2 grid-rows-2 gap-1 overflow-hidden lg:col-span-7">
            <figure className="group relative row-span-2 overflow-hidden bg-white/5">
              <img src="/assets/u40-hostel-room.png" alt="A clean single room at U40 Academy Inn with a study desk, bed and window" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" loading="lazy" width="1086" height="1448" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-5 pt-16 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-white">Simple, private study space</figcaption>
            </figure>
            <figure className="group relative overflow-hidden bg-white/5">
              <img src="/assets/u40-meal-fish.png" alt="A balanced Bengali-style hostel meal with rice, fish, dal and vegetables" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" loading="lazy" width="1536" height="1024" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-5 pt-14 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-white">Fresh Bengali-style meals</figcaption>
            </figure>
            <figure className="group relative overflow-hidden bg-white/5">
              <img src="/assets/u40-breakfast.png" alt="Ghugni muri, tea and biscuits served for hostel breakfast" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" loading="lazy" width="1536" height="1024" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-5 pt-14 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-white">A familiar start to the day</figcaption>
            </figure>
          </div>
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
