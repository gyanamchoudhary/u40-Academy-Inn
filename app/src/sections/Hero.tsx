import { ArrowDownRight, ArrowRight, Check } from "lucide-react";
import { heroStats } from "@/data/institute";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#f7f6f2] pt-20">
      <div className="mx-auto max-w-[90rem] border-x border-black/10">
        <div className="page-grid min-h-[calc(100dvh-5rem)]">
          <div className="col-span-12 flex flex-col justify-center px-5 py-16 sm:px-8 lg:col-span-7 lg:px-10 lg:py-24 xl:px-14">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 bg-[#2046d8]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#555b66]">Admissions open for 2026–27</span>
            </div>

            <h1 className="mt-8 max-w-[13ch] text-[3.65rem] font-semibold leading-[0.9] tracking-[-0.065em] text-[#111318] sm:text-7xl lg:text-[5.6rem] xl:text-[6.8rem]">
              Study with purpose. <span className="text-[#2046d8]">Grow with discipline.</span>
            </h1>

            <p className="mt-8 max-w-[40rem] text-lg leading-8 text-[#555b66]">
              U40 is a residential science academy in Malda for students preparing for Higher Secondary, NEET, IIT-JEE and WBJEE examinations.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#admissions" className="group inline-flex min-h-13 items-center justify-center gap-3 bg-[#2046d8] px-6 py-4 text-sm font-bold text-white transition duration-200 hover:bg-[#1737ae] active:scale-[0.98]">
                Start admission inquiry <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <a href="#programs" className="inline-flex min-h-13 items-center justify-center gap-3 border border-black/20 bg-white px-6 py-4 text-sm font-bold text-[#111318] transition duration-200 hover:border-black/40 active:scale-[0.98]">
                Explore programs <ArrowDownRight className="h-4 w-4 text-[#2046d8]" />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-black/10 pt-6">
              {["Classes IX–XII", "Boys’ residential campus", "Personal mentorship"].map((item) => (
                <span key={item} className="flex items-center gap-2 text-sm font-semibold text-[#555b66]"><Check className="h-4 w-4 text-[#2046d8]" />{item}</span>
              ))}
            </div>
          </div>

          <div className="relative col-span-12 min-h-[32rem] overflow-hidden border-t border-black/10 lg:col-span-5 lg:border-l lg:border-t-0">
            <img src="/assets/u40-hostel-exterior.png" alt="U40 Academy Inn residential building in Malda" className="absolute inset-0 h-full w-full object-cover object-[52%_50%]" width="1212" height="1298" fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/10" />
            <div className="absolute left-5 top-5 bg-[#d9f66f] px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#111318] sm:left-8 sm:top-8">Established 2012</div>
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 bg-[#111318]/90 text-white backdrop-blur-sm">
              {heroStats.map((stat) => (
                <div key={stat.label} className="border-r border-t border-white/15 p-5">
                  <p className="text-3xl font-semibold tabular-nums text-[#d9f66f]">{stat.value}</p>
                  <p className="mt-1 text-xs leading-5 text-white/65">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
