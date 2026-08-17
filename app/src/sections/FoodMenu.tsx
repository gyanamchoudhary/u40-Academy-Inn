import {
  Coffee,
  Drumstick,
  Egg,
  Fish,
  Leaf,
  MoonStar,
  Soup,
  SunMedium,
} from "lucide-react";
import { OptimizedImage } from "@/components/site/OptimizedImage";

const mealTimes = [
  {
    icon: SunMedium,
    time: "Morning",
    title: "Breakfast",
    note: "A warm, familiar start before classes.",
    items: ["Tea with biscuits", "Ghugni muri"],
  },
  {
    icon: Soup,
    time: "Midday",
    title: "Lunch",
    note: "Steamed rice is served with every lunch.",
    items: ["Fish · 3 days a week", "Egg · 3 days a week", "Chicken · 1 day a week"],
  },
  {
    icon: Coffee,
    time: "Evening",
    title: "Tiffin",
    note: "A simple refreshment between study sessions.",
    items: ["Tea with biscuits"],
  },
  {
    icon: MoonStar,
    time: "Night",
    title: "Dinner",
    note: "A balanced vegetarian meal served with rice.",
    items: ["Dal", "Mixed vegetables", "Papad", "Chutney"],
  },
];

const lunchRotation = [
  { icon: Fish, label: "Fish", frequency: "3 days / week" },
  { icon: Egg, label: "Egg", frequency: "3 days / week" },
  { icon: Drumstick, label: "Chicken", frequency: "1 day / week" },
];

export function FoodMenu() {
  return (
    <section id="food-menu" className="relative overflow-hidden bg-[#f7f4ed] py-24 text-[#111318] sm:py-32">
      <div className="pointer-events-none absolute inset-0 rule-grid opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="page-grid items-end gap-y-8 border-b border-black/15 pb-10">
          <div className="col-span-12 lg:col-span-8">
            <div className="mb-6 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#2046d8]">
              <Leaf className="h-4 w-4" strokeWidth={1.8} />
              Hostel dining · Everyday menu
            </div>
            <h2 className="max-w-5xl text-[clamp(3rem,7vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.07em]">
              Food that feels
              <span className="block text-[#2046d8]">like home.</span>
            </h2>
          </div>
          <p className="col-span-12 max-w-md text-base leading-7 text-[#575d66] lg:col-span-4 lg:pb-2">
            Fresh, homely Bengali-style meals made for a student’s daily rhythm—simple, nourishing and served on time.
          </p>
        </div>

        <div className="page-grid gap-y-12 pt-12 lg:pt-16">
          <div className="col-span-12 lg:col-span-7">
            <div className="grid border-l border-t border-black/15 sm:grid-cols-2">
              {mealTimes.map((meal, index) => (
                <article
                  key={meal.title}
                  className="group relative min-h-[20rem] border-b border-r border-black/15 bg-[#fbfaf6]/75 p-6 transition-colors duration-300 hover:bg-white sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid h-12 w-12 place-items-center border border-black/15 bg-white text-[#2046d8] transition-colors duration-300 group-hover:bg-[#d9f66f] group-hover:text-[#111318]">
                      <meal.icon className="h-5 w-5" strokeWidth={1.7} />
                    </div>
                    <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-black/35">0{index + 1}</span>
                  </div>
                  <p className="mt-10 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#2046d8]">{meal.time}</p>
                  <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">{meal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#70747b]">{meal.note}</p>
                  <ul className="mt-6 space-y-2.5" aria-label={`${meal.title} items`}>
                    {meal.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-bold">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2046d8]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <figure className="relative min-h-[26rem] overflow-hidden bg-[#111318] lg:min-h-[31rem]">
              <OptimizedImage
                src="/assets/u40-meal-fish.png"
                alt="Fresh Bengali-style lunch with rice, fish curry, dal and vegetables"
                className="absolute inset-0 h-full w-full object-cover"
                width={1536}
                height={1024}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-transparent" aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9f66f]">From our kitchen</span>
                <p className="mt-3 max-w-sm text-2xl font-extrabold leading-tight tracking-[-0.03em]">Freshly prepared, familiar Bengali flavours.</p>
              </figcaption>
            </figure>

            <div className="bg-[#111318] p-6 text-white sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-5">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9f66f]">Weekly lunch rotation</p>
                  <h3 className="mt-2 text-xl font-bold tracking-[-0.025em]">Rice included daily</h3>
                </div>
                <Soup className="h-6 w-6 shrink-0 text-[#d9f66f]" strokeWidth={1.5} />
              </div>
              <div className="divide-y divide-white/15">
                {lunchRotation.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 py-4">
                    <item.icon className="h-5 w-5 text-[#d9f66f]" strokeWidth={1.6} />
                    <span className="font-bold">{item.label}</span>
                    <span className="ml-auto font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/55">{item.frequency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-black/15 pt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#62666e] sm:flex-row sm:items-center sm:justify-between">
          <p>Simple · fresh · nourishing · student-friendly</p>
          <p>Prepared with care for U40 residents</p>
        </div>
      </div>
    </section>
  );
}
