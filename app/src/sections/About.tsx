import { ArrowUpRight } from "lucide-react";
import { OptimizedImage } from "@/components/site/OptimizedImage";

const supportSystems = [
  {
    number: "01",
    title: "Learn deeply",
    text: "Board concepts connect directly with entrance-level problem solving and practical science.",
  },
  {
    number: "02",
    title: "Practise with support",
    text: "Scheduled revision, tests and doubt clearing keep questions from becoming learning gaps.",
  },
  {
    number: "03",
    title: "Live with rhythm",
    text: "A supervised routine gives study, meals, personal time and rest a dependable place in the day.",
  },
  {
    number: "04",
    title: "Feel looked after",
    text: "Resident staff coordinate academics, accommodation, food and everyday student wellbeing.",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-20 overflow-hidden bg-[#f3f0e8] py-24 text-[#111318] sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 rule-grid opacity-25"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <header className="page-grid items-end gap-y-10 border-b border-black/15 pb-12">
          <div className="col-span-12 lg:col-span-8">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#2046d8]">
              Why the U40 model works
            </p>
            <h2 className="mt-6 max-w-[12ch] text-balance text-[clamp(3.4rem,6.8vw,7rem)] font-extrabold leading-[0.88] tracking-[-0.07em]">
              One campus. Four systems.{" "}
              <span className="text-[#2046d8]">
                No student manages the gaps alone.
              </span>
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:pb-2">
            <p className="max-w-md text-base leading-7 text-[#575d66]">
              Learning does not stop when a class ends. At U40, teaching, guided
              practice, residence and daily care work as one system—so students
              can put their energy where it matters.
            </p>
            <a
              href="#hostel"
              className="group mt-7 inline-flex min-h-11 items-center gap-2 border-b border-[#2046d8] pb-1 text-sm font-bold text-[#2046d8] transition duration-200 hover:text-[#1737ae] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2046d8] focus-visible:ring-offset-4"
            >
              Follow a day on campus
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </header>

        <div className="mt-12 grid gap-3 lg:min-h-[47rem] lg:grid-cols-12">
          <figure className="group relative min-h-[34rem] overflow-hidden bg-[#071a2d] lg:col-span-7">
            <OptimizedImage
              src="/assets/u40-science-lab-v2.png"
              alt="U40 students carrying out practical science work with a teacher"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              width={1536}
              height={1024}
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#06182b]/95 via-[#06182b]/5 to-[#06182b]/10"
              aria-hidden="true"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9 lg:p-10">
              <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9f66f]">
                <span className="h-px w-7 bg-[#d9f66f]" />
                01 · Understand by doing
              </div>
              <h3 className="mt-4 max-w-[13ch] text-4xl font-extrabold leading-[0.96] tracking-[-0.055em] sm:text-5xl lg:text-[3.75rem]">
                Science moves from concept to application.
              </h3>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
                Lessons connect explanation, practical work and exam-focused
                problem solving—building understanding students can use.
              </p>
            </figcaption>
          </figure>

          <div className="grid gap-3 lg:col-span-5 lg:grid-rows-[1.12fr_0.88fr]">
            <figure className="group relative min-h-[25rem] overflow-hidden bg-[#071a2d]">
              <OptimizedImage
                src="/assets/u40-campus-study-v2.png"
                alt="A teacher guiding U40 students during an evening study session"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                width={1536}
                height={1024}
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#06182b]/90 via-transparent to-transparent"
                aria-hidden="true"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#d9f66f]">
                  02 · Guided practice
                </p>
                <h3 className="mt-3 max-w-[16ch] text-3xl font-extrabold leading-tight tracking-[-0.045em] sm:text-4xl">
                  Questions get attention while they are still fresh.
                </h3>
              </figcaption>
            </figure>

            <div className="grid gap-3 sm:grid-cols-2">
              <figure className="group relative min-h-[21rem] overflow-hidden bg-[#d8d3c8]">
                <OptimizedImage
                  src="/assets/u40-hostel-room.png"
                  alt="A clean U40 hostel room with a bed, study desk and window"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  width={1536}
                  height={2048}
                  sizes="(max-width: 640px) 100vw, 22vw"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#06182b]/90 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#d9f66f]">
                    03 · Space to reset
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.035em]">
                    Rest has a place in the plan.
                  </h3>
                </figcaption>
              </figure>

              <figure className="group relative min-h-[21rem] overflow-hidden bg-[#2a1710]">
                <OptimizedImage
                  src="/assets/u40-dinner.png"
                  alt="A balanced U40 dinner with rice, dal, vegetables, papad and chutney"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  width={1536}
                  height={1024}
                  sizes="(max-width: 640px) 100vw, 22vw"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#06182b]/90 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#d9f66f]">
                    04 · Everyday care
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.035em]">
                    Familiar meals keep long days steady.
                  </h3>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        <div className="mt-3 grid border-l border-t border-black/15 sm:grid-cols-2 lg:grid-cols-4">
          {supportSystems.map(item => (
            <article
              key={item.number}
              className="group min-h-[11rem] border-b border-r border-black/15 bg-white/45 p-6 transition duration-300 hover:bg-[#d9f66f] sm:min-h-[14rem] sm:p-7"
            >
              <span className="font-mono text-[10px] font-bold text-[#2046d8] transition-transform duration-300 group-hover:translate-x-1">
                {item.number}
              </span>
              <h3 className="mt-8 text-xl font-extrabold tracking-[-0.03em]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#60646c] transition-colors duration-300 group-hover:text-black/65">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
