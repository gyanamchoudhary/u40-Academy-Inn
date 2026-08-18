import { ArrowDownRight, ArrowRight, Check } from "lucide-react";
import { OptimizedImage } from "@/components/site/OptimizedImage";
import { cn } from "@/lib/utils";
import { heroStats } from "@/data/institute";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-[#071a2d] text-white">
      <OptimizedImage
        src="/assets/u40-hostel-exterior.png"
        alt="U40 Academy Inn residential building in Malda"
        className="absolute inset-0 h-full w-full object-cover object-[58%_48%]"
        width={1212}
        height={1298}
        fetchPriority="high"
        loading="eager"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,38,.96)_0%,rgba(5,20,38,.82)_42%,rgba(5,20,38,.2)_78%,rgba(5,20,38,.08)_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06182b]/90 via-transparent to-[#06182b]/45" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[90rem] flex-col justify-end px-5 pb-6 pt-32 sm:px-8 sm:pb-8 lg:px-10">
        <div className="max-w-[54rem] pb-10 sm:pb-12">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-[#d9f66f]" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">Admissions open for 2026–27</span>
          </div>

          <h1 className="mt-7 max-w-[20ch] text-[clamp(3.1rem,14.7vw,3.6rem)] font-semibold leading-[0.9] tracking-[-0.04em] sm:text-7xl lg:text-[6rem]">
            Study with purpose. <span className="text-[#d9f66f]">Grow with discipline.</span>
          </h1>

          <p className="mt-7 max-w-[38rem] border-l border-white/35 pl-5 text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
            U40 is a residential science academy in Malda for students preparing for Higher Secondary, NEET, IIT-JEE and WBJEE examinations.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#admissions" className="group inline-flex min-h-[3.25rem] items-center justify-center gap-3 bg-[#d9f66f] px-6 py-4 text-sm font-bold text-[#111318] transition duration-200 hover:bg-white active:scale-[0.98]">
              Start admission inquiry <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a href="#programs" className="inline-flex min-h-[3.25rem] items-center justify-center gap-3 border border-white/35 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-sm transition duration-200 hover:bg-white hover:text-[#111318] active:scale-[0.98]">
              Explore programs <ArrowDownRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-5">
            {["Classes IX–XII", "Boys’ residential campus", "Personal mentorship"].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm font-semibold text-white/70"><Check className="h-4 w-4 text-[#d9f66f]" />{item}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 overflow-hidden border border-white/20 bg-[#081a2b]/80 text-white backdrop-blur-md lg:grid-cols-4">
          {heroStats.map((stat, index) => (
            <div key={stat.label} className={cn(
              "border-b border-r border-white/15 p-4 sm:p-5 lg:border-b-0",
              index % 2 === 1 && "border-r-0 lg:border-r",
              index >= 2 && "border-b-0",
              index === heroStats.length - 1 && "lg:border-r-0"
            )}>
              <p className="text-2xl font-semibold tabular-nums text-[#d9f66f] sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs leading-5 text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
