import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navItems } from "@/data/institute";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 border-b transition duration-200", scrolled || open ? "border-black/10 bg-[#f7f6f2]/95 backdrop-blur-xl" : "border-transparent bg-[#f7f6f2]")}>
      <a href="#main-content" className="absolute left-4 top-3 -translate-y-20 bg-[#111318] px-4 py-2 text-sm font-bold text-white transition focus:translate-y-0">Skip to content</a>
      <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="#top" className="flex items-center gap-3" aria-label="U40 Academy Inn home">
          <img src="/assets/u40-mark.svg" alt="" className="h-11 w-11" width="44" height="44" />
          <span>
            <span className="block text-[15px] font-extrabold leading-none tracking-[-0.02em] text-[#111318]">U40 Academy Inn</span>
            <span className="mt-1.5 block font-mono text-[8px] font-medium uppercase tracking-[0.18em] text-[#555b66]">Residential science institute</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {navItems.slice(0, 6).map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-semibold text-[#4d5159] transition duration-200 hover:text-[#2046d8]">{item.label}</a>
          ))}
        </nav>

        <a href="#admissions" className="group hidden min-h-11 items-center gap-3 bg-[#111318] px-5 text-sm font-bold text-white transition duration-200 hover:bg-[#2046d8] active:scale-[0.98] lg:flex">
          Apply now <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
        </a>

        <button type="button" onClick={() => setOpen((value) => !value)} className="grid h-11 w-11 cursor-pointer place-items-center border border-black/15 bg-white transition hover:border-black/30 lg:hidden" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn("grid overflow-hidden bg-[#f7f6f2] transition-[grid-template-rows] duration-200 lg:hidden", open ? "grid-rows-[1fr] border-t border-black/10" : "grid-rows-[0fr]")}>
        <div className="min-h-0">
          <nav className="px-5 py-4" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-between border-b border-black/10 text-base font-semibold text-[#111318]">
                {item.label}<ArrowUpRight className="h-4 w-4 text-[#2046d8]" />
              </a>
            ))}
            <a href="#admissions" onClick={() => setOpen(false)} className="mt-5 flex min-h-12 items-center justify-between bg-[#2046d8] px-5 font-bold text-white">Apply for admission <ArrowUpRight className="h-4 w-4" /></a>
          </nav>
        </div>
      </div>
    </header>
  );
}
