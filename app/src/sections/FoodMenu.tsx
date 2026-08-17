import { useEffect, useState } from "react";
import {
  Coffee,
  Drumstick,
  Egg,
  Fish,
  Leaf,
  MoonStar,
  Pause,
  Play,
  Soup,
  SunMedium,
} from "lucide-react";
import { OptimizedImage } from "@/components/site/OptimizedImage";

const MEAL_INTERVAL = 5500;

const mealTimes = [
  {
    icon: SunMedium,
    time: "Morning",
    title: "Breakfast",
    note: "A warm, familiar start before classes.",
    items: ["Tea with biscuits", "Ghugni muri"],
    image: "/assets/u40-breakfast.png",
    imageAlt: "Warm U40 breakfast of ghugni muri, tea and biscuits",
    imageLabel: "Morning breakfast",
    imageCaption: "A warm start before the first class.",
    imageBadge: "Ghugni muri · tea · biscuits",
    careLine: "A settled morning starts with something warm and familiar.",
  },
  {
    icon: Soup,
    time: "Midday",
    title: "Lunch",
    note: "Steamed rice with a rotating protein through the week.",
    items: ["Fish", "Egg", "Chicken"],
    image: "/assets/u40-meal-fish.png",
    imageAlt:
      "Bengali-style U40 lunch with rice, fish curry, dal, vegetables and salad",
    imageLabel: "Midday lunch",
    imageCaption: "A generous midday meal for the rest of the school day.",
    imageBadge: "Rice · dal · rotating protein",
    careLine: "The main meal is planned to keep long learning days steady.",
  },
  {
    icon: Coffee,
    time: "Evening",
    title: "Tiffin",
    note: "A simple refreshment between study sessions.",
    items: ["Tea with biscuits"],
    image: "/assets/u40-tiffin.png",
    imageAlt: "Evening U40 tiffin with warm milk tea and biscuits",
    imageLabel: "Evening tiffin",
    imageCaption: "A simple pause between study blocks.",
    imageBadge: "Tea · biscuits",
    careLine: "A small evening break makes space to reset and refocus.",
  },
  {
    icon: MoonStar,
    time: "Night",
    title: "Dinner",
    note: "A balanced vegetarian meal to close the day.",
    items: ["Rice", "Dal", "Vegetables", "Papad", "Chutney"],
    image: "/assets/u40-dinner.png",
    imageAlt:
      "Balanced U40 dinner with rice, dal, vegetables, papad and chutney",
    imageLabel: "Night dinner",
    imageCaption: "A balanced, familiar close to the day.",
    imageBadge: "Rice · dal · vegetables",
    careLine: "Dinner closes the routine with comforting, home-style food.",
  },
];

const lunchRotation = [
  { icon: Fish, label: "Fish", frequency: "3 days" },
  { icon: Egg, label: "Egg", frequency: "3 days" },
  { icon: Drumstick, label: "Chicken", frequency: "1 day" },
];

const careDetails = [
  {
    number: "01",
    title: "A dependable routine",
    text: "Four food breaks are planned around classes, self-study and rest.",
  },
  {
    number: "02",
    title: "Food students know",
    text: "Familiar Bengali-style dishes help residential life feel more like home.",
  },
  {
    number: "03",
    title: "Variety through the week",
    text: "Lunch rotates between fish, egg and chicken, with rice served daily.",
  },
];

export function FoodMenu() {
  const [activeMealIndex, setActiveMealIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTimelineHovered, setIsTimelineHovered] = useState(false);
  const [isTimelineFocused, setIsTimelineFocused] = useState(false);
  const activeMeal = mealTimes[activeMealIndex];
  const nextMealIndex = (activeMealIndex + 1) % mealTimes.length;
  const nextMeal = mealTimes[nextMealIndex];
  const isAutoPaused = isPaused || isTimelineHovered || isTimelineFocused;

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isAutoPaused || reduceMotion) return;

    const timer = window.setTimeout(() => {
      setActiveMealIndex(current => (current + 1) % mealTimes.length);
    }, MEAL_INTERVAL);

    return () => window.clearTimeout(timer);
  }, [activeMealIndex, isAutoPaused]);

  return (
    <section
      id="food-menu"
      className="relative overflow-hidden bg-[#f7f4ed] py-24 text-[#111318] sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 rule-grid opacity-30"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <header className="page-grid items-end gap-y-10 border-b border-black/15 pb-12">
          <div className="col-span-12 lg:col-span-8">
            <div className="mb-6 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#2046d8]">
              <Leaf className="h-4 w-4" strokeWidth={1.8} />
              Hostel dining · Daily care
            </div>
            <h2 className="max-w-5xl text-[clamp(3rem,6.5vw,6.6rem)] font-extrabold leading-[0.9] tracking-[-0.07em] text-balance">
              Four moments of care,
              <span className="block text-[#2046d8]">
                from breakfast to lights-out.
              </span>
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:pb-2">
            <p className="max-w-md text-base leading-7 text-[#575d66]">
              When students live away from home, meals become part of the
              support system. U40 plans familiar food around the rhythm of
              classes, guided study and rest.
            </p>
            <div className="mt-7 grid grid-cols-[4.5rem_1fr] items-center border-t border-black/15 pt-5">
              <strong className="text-5xl font-extrabold leading-none tracking-[-0.06em] text-[#2046d8]">
                4
              </strong>
              <span className="text-sm font-bold leading-5 text-[#33373f]">
                planned meal breaks
                <span className="block font-normal text-[#70747b]">
                  every day on campus
                </span>
              </span>
            </div>
          </div>
        </header>

        <div className="page-grid gap-y-5 pt-12 lg:pt-16">
          <div className="col-span-12 grid min-h-[46rem] gap-3 sm:grid-cols-2 sm:grid-rows-[1fr_15rem] lg:col-span-7">
            <figure className="relative min-h-[29rem] overflow-hidden bg-[#111318] sm:col-span-2">
              {mealTimes.map((meal, index) => {
                const isActive = index === activeMealIndex;

                return (
                  <OptimizedImage
                    key={meal.title}
                    src={meal.image}
                    alt={isActive ? meal.imageAlt : ""}
                    aria-hidden={!isActive}
                    className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out ${
                      isActive
                        ? "scale-100 opacity-100"
                        : "pointer-events-none scale-[1.025] opacity-0"
                    }`}
                    width={1536}
                    height={1024}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                );
              })}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/10"
                aria-hidden="true"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 text-white sm:flex-row sm:items-end sm:justify-between sm:p-8">
                <div key={activeMeal.title} className="campus-copy-reveal">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9f66f]">
                    {activeMeal.imageLabel}
                  </span>
                  <p className="mt-3 max-w-md text-3xl font-extrabold leading-tight tracking-[-0.04em] sm:text-4xl">
                    {activeMeal.imageCaption}
                  </p>
                </div>
                <span
                  key={activeMeal.imageBadge}
                  className="campus-copy-reveal shrink-0 border border-white/25 bg-black/25 px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-sm"
                >
                  {activeMeal.imageBadge}
                </span>
              </figcaption>
            </figure>

            <button
              type="button"
              onClick={() => setActiveMealIndex(nextMealIndex)}
              className="group relative min-h-[15rem] overflow-hidden bg-[#3a251a] text-left"
              aria-label={`Show ${nextMeal.title} menu`}
            >
              <OptimizedImage
                key={nextMeal.image}
                src={nextMeal.image}
                alt=""
                className="campus-image-reveal absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                width={1536}
                height={1024}
                sizes="(max-width: 640px) 100vw, 30vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"
                aria-hidden="true"
              />
              <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#d9f66f]">
                  Up next · {nextMeal.time}
                </span>
                <span className="mt-1 flex items-center justify-between gap-4 text-lg font-extrabold">
                  {nextMeal.title}
                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/65"
                    aria-hidden="true"
                  >
                    View →
                  </span>
                </span>
                <p className="mt-1 text-sm text-white/70">
                  {nextMeal.imageCaption}
                </p>
              </span>
            </button>

            <aside className="flex min-h-[15rem] flex-col justify-between bg-[#2046d8] p-6 text-white sm:p-7">
              <Soup className="h-7 w-7 text-[#d9f66f]" strokeWidth={1.6} />
              <blockquote
                key={activeMeal.careLine}
                className="campus-copy-reveal mt-8 text-2xl font-extrabold leading-tight tracking-[-0.035em]"
              >
                “{activeMeal.careLine}”
              </blockquote>
              <p className="mt-4 text-xs leading-5 text-white/65">
                A predictable meal rhythm helps students move through a long
                residential day with confidence.
              </p>
            </aside>
          </div>

          <aside className="col-span-12 flex flex-col bg-[#111318] p-6 text-white sm:p-8 lg:col-span-5 lg:p-10">
            <div className="flex items-start justify-between gap-5 border-b border-white/15 pb-7">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9f66f]">
                  A student’s food day
                </p>
                <h3 className="mt-3 text-3xl font-extrabold tracking-[-0.04em]">
                  A steady rhythm from morning to night.
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPaused(current => !current)}
                className="grid h-11 w-11 shrink-0 place-items-center border border-white/15 text-[#d9f66f] transition-colors hover:border-[#d9f66f] hover:bg-[#d9f66f] hover:text-[#111318] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9f66f]"
                aria-label={
                  isPaused ? "Resume meal slideshow" : "Pause meal slideshow"
                }
              >
                {isPaused ? (
                  <Play className="h-4 w-4" fill="currentColor" />
                ) : (
                  <Pause className="h-4 w-4" fill="currentColor" />
                )}
              </button>
            </div>

            <ol
              className="divide-y divide-white/15"
              aria-label="Daily meal schedule"
              onMouseLeave={() => setIsTimelineHovered(false)}
              onFocusCapture={() => setIsTimelineFocused(true)}
              onBlurCapture={event => {
                if (
                  !event.currentTarget.contains(event.relatedTarget as Node)
                ) {
                  setIsTimelineFocused(false);
                }
              }}
            >
              {mealTimes.map((meal, index) => (
                <li key={meal.title} className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveMealIndex(index)}
                    onMouseEnter={() => {
                      setIsTimelineHovered(true);
                      setActiveMealIndex(index);
                    }}
                    onFocus={() => setActiveMealIndex(index)}
                    aria-pressed={index === activeMealIndex}
                    className={`group grid w-full grid-cols-[3rem_1fr] gap-4 px-3 py-6 text-left transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#d9f66f] ${
                      index === activeMealIndex
                        ? "bg-white/[0.06]"
                        : "hover:bg-white/[0.035]"
                    }`}
                  >
                    <span
                      className={`grid h-11 w-11 place-items-center border transition-colors ${
                        index === activeMealIndex
                          ? "border-[#d9f66f] bg-[#d9f66f] text-[#111318]"
                          : "border-white/15 text-[#d9f66f] group-hover:border-[#d9f66f]"
                      }`}
                    >
                      <meal.icon className="h-5 w-5" strokeWidth={1.7} />
                    </span>
                    <span>
                      <span className="flex items-baseline justify-between gap-4">
                        <span>
                          <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#d9f66f]">
                            0{index + 1} · {meal.time}
                          </span>
                          <span className="mt-1 block text-xl font-extrabold tracking-[-0.025em]">
                            {meal.title}
                          </span>
                        </span>
                        <span className="font-mono text-[9px] font-semibold text-white/30">
                          0{index + 1}/04
                        </span>
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-white/55">
                        {meal.note}
                      </span>
                      <span
                        className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5"
                        aria-label={`${meal.title} items`}
                      >
                        {meal.items.map(item => (
                          <span
                            key={item}
                            className="flex items-center gap-2 text-xs font-semibold text-white/80"
                          >
                            <span
                              className="h-1 w-1 bg-[#d9f66f]"
                              aria-hidden="true"
                            />
                            {item}
                          </span>
                        ))}
                      </span>
                    </span>
                  </button>
                  {index === activeMealIndex && !isAutoPaused && (
                    <span
                      className="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-white/10"
                      aria-hidden="true"
                    >
                      <span className="campus-progress block h-full origin-left bg-[#d9f66f]" />
                    </span>
                  )}
                </li>
              ))}
            </ol>

            <div className="mt-auto border-t border-white/15 pt-7">
              <div className="flex items-end justify-between gap-5">
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#d9f66f]">
                    Seven-day lunch rotation
                  </p>
                  <p className="mt-2 text-sm text-white/55">
                    One protein option is served with rice each day.
                  </p>
                </div>
                <span className="text-4xl font-extrabold tracking-[-0.06em] text-[#d9f66f]">
                  7/7
                </span>
              </div>
              <div className="mt-6 grid grid-cols-3 divide-x divide-white/15 border-y border-white/15 py-5">
                {lunchRotation.map(item => (
                  <div key={item.label} className="px-3 first:pl-0 last:pr-0">
                    <item.icon
                      className="h-4 w-4 text-[#d9f66f]"
                      strokeWidth={1.6}
                    />
                    <p className="mt-3 text-sm font-bold">{item.label}</p>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-white/45">
                      {item.frequency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-16 border-y border-black/15">
          <div className="page-grid gap-y-8 py-10 sm:py-12">
            <div className="col-span-12 lg:col-span-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#2046d8]">
                What daily care looks like
              </p>
              <h3 className="mt-4 max-w-sm text-3xl font-extrabold leading-tight tracking-[-0.04em]">
                Small routines that make residential life feel supported.
              </h3>
            </div>
            <div className="col-span-12 grid sm:grid-cols-3 lg:col-span-8">
              {careDetails.map(detail => (
                <article
                  key={detail.number}
                  className="border-t border-black/15 py-6 sm:border-l sm:border-t-0 sm:px-6 sm:py-0"
                >
                  <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-[#2046d8]">
                    {detail.number}
                  </span>
                  <h4 className="mt-4 text-base font-extrabold">
                    {detail.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-[#656a72]">
                    {detail.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
