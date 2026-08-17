import { useEffect, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { OptimizedImage } from "@/components/site/OptimizedImage";

const TRANSITION_DELAY = 5500;

const moments = [
  {
    time: "06:30",
    period: "Morning",
    title: "Prepare, settle, begin.",
    description:
      "A calm room routine helps students arrive organised and ready for the first study block.",
    image: "/assets/u40-day-morning-v2.png",
    alt: "U40 students preparing books and making their beds at sunrise",
    position: "object-center",
  },
  {
    time: "10:00",
    period: "Class hours",
    title: "Think it through.",
    description:
      "Discussion-led classes ask students to explain, question and solve—not simply copy from the board.",
    image: "/assets/u40-day-class-v2.png",
    alt: "A U40 student discussing a physics problem with his teacher and classmates",
    position: "object-center",
  },
  {
    time: "18:00",
    period: "Guided study",
    title: "Questions get answered.",
    description:
      "Resident teachers make time for one-to-one doubt clearing, revision and preparation for tomorrow.",
    image: "/assets/u40-day-study-v2.png",
    alt: "A U40 teacher giving one-to-one help during evening study",
    position: "object-center",
  },
  {
    time: "22:00",
    period: "Night",
    title: "Rest with tomorrow ready.",
    description:
      "A supervised lights-out routine closes the day calmly and helps students recover well.",
    image: "/assets/u40-day-night-v2.png",
    alt: "A resident mentor checking in as U40 students return to their hostel rooms at night",
    position: "object-center",
  },
];

const essentials = [
  "24-hour teacher support",
  "RO water",
  "Guided Wi-Fi",
  "Smart classrooms",
  "Regular counselling",
];

export function CampusLife() {
  const [activeMoment, setActiveMoment] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTimelineHovered, setIsTimelineHovered] = useState(false);
  const [isTimelineFocused, setIsTimelineFocused] = useState(false);
  const active = moments[activeMoment];
  const isAutoPaused = isPaused || isTimelineHovered || isTimelineFocused;

  useEffect(() => {
    if (
      isAutoPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const timer = window.setTimeout(() => {
      setActiveMoment(current => (current + 1) % moments.length);
    }, TRANSITION_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeMoment, isAutoPaused]);

  return (
    <section
      id="hostel"
      className="relative h-[calc(100dvh-5rem)] min-h-[36rem] overflow-hidden bg-[#071a2d] text-white"
    >
      <span id="facilities" className="absolute top-0" aria-hidden="true" />

      {moments.map((moment, index) => {
        const isActive = activeMoment === index;

        return (
          <OptimizedImage
            key={moment.image}
            src={moment.image}
            alt={isActive ? moment.alt : ""}
            aria-hidden={!isActive}
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out ${moment.position} ${
              isActive
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-[1.025] opacity-0"
            }`}
            width={1536}
            height={1024}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "low"}
            sizes="100vw"
          />
        );
      })}
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,18,33,.96)_0%,rgba(5,18,33,.78)_45%,rgba(5,18,33,.18)_78%,rgba(5,18,33,.08)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#06182b]/95 via-transparent to-[#06182b]/40"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex h-full max-w-[90rem] flex-col px-5 sm:px-8 lg:px-10">
        <div className="flex min-h-0 flex-1 items-center py-6 sm:py-8">
          <div className="max-w-[50rem]">
            <div className="flex items-center justify-between gap-5 sm:justify-start">
              <p className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d9f66f]">
                <span className="h-px w-8 bg-[#d9f66f]" />
                Life on campus
              </p>
              <button
                type="button"
                onClick={() => setIsPaused(current => !current)}
                className="inline-flex min-h-9 cursor-pointer items-center gap-2 border border-white/25 bg-black/15 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70 backdrop-blur-sm transition hover:border-[#d9f66f] hover:text-[#d9f66f]"
                aria-label={
                  isPaused
                    ? "Resume automatic campus-life slideshow"
                    : "Pause automatic campus-life slideshow"
                }
              >
                {isPaused ? (
                  <Play className="h-3 w-3" fill="currentColor" />
                ) : (
                  <Pause className="h-3 w-3" fill="currentColor" />
                )}
                {isPaused ? "Play" : "Pause"}
              </button>
            </div>

            <h2 className="mt-5 max-w-[20ch] text-[clamp(3.3rem,6.2vw,6.8rem)] font-semibold leading-[0.86] tracking-[-0.065em]">
              From first light to{" "}
              <span className="text-[#d9f66f]">lights out.</span>
            </h2>

            <div
              key={`${active.time}-copy`}
              className="campus-copy-reveal mt-6 border-l border-white/35 pl-5 sm:mt-7"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d9f66f]">
                {active.time} · {active.period} · 0{activeMoment + 1}/04
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                {active.title}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
                {active.description}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              {essentials.map(item => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-[11px] font-semibold text-white/55"
                >
                  <span className="h-1 w-1 bg-[#d9f66f]" />
                  {item}
                </span>
              ))}
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 text-[11px] font-bold text-[#d9f66f] transition hover:text-white"
              >
                Plan a visit{" "}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>

        <div
          className="grid shrink-0 border-x border-t border-white/20 bg-[#081a2b]/82 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4"
          role="tablist"
          aria-label="A day at U40"
          onMouseLeave={() => setIsTimelineHovered(false)}
          onFocusCapture={() => setIsTimelineFocused(true)}
          onBlurCapture={event => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setIsTimelineFocused(false);
            }
          }}
        >
          {moments.map((moment, index) => {
            const isActive = activeMoment === index;
            return (
              <button
                key={moment.time}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveMoment(index)}
                onMouseEnter={() => {
                  setIsTimelineHovered(true);
                  setActiveMoment(index);
                }}
                onFocus={() => setActiveMoment(index)}
                className={`group relative flex min-h-[4.5rem] cursor-pointer items-center gap-4 overflow-hidden border-b border-r border-white/15 px-4 py-3 text-left transition duration-300 sm:min-h-[5rem] sm:px-5 ${isActive ? "bg-[#d9f66f] text-[#111318]" : "text-white hover:bg-white/[0.08]"}`}
              >
                <span
                  className={`font-mono text-[11px] font-semibold ${isActive ? "text-black/70" : "text-[#d9f66f]"}`}
                >
                  0{index + 1}
                </span>
                <span>
                  <span
                    className={`block font-mono text-[10px] uppercase tracking-[0.13em] ${isActive ? "text-black/70" : "text-white/35"}`}
                  >
                    {moment.time}
                  </span>
                  <span className="mt-0.5 block text-sm font-bold tracking-[-0.01em] sm:text-base">
                    {moment.period}
                  </span>
                </span>
                <span
                  className={`ml-auto h-2 w-2 rounded-full ${isActive ? "bg-[#111318]" : "border border-white/30"}`}
                  aria-hidden="true"
                />
                {isActive && !isAutoPaused ? (
                  <span
                    key={`${activeMoment}-${isAutoPaused}`}
                    className="campus-progress absolute inset-x-0 bottom-0 h-[3px] origin-left bg-[#111318]"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
