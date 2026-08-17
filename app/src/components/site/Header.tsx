import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navItems } from "@/data/institute";

export function Header({ forceScrolled = false }: { forceScrolled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(forceScrolled);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header data-header={scrolled || open ? "scrolled" : "top"} data-force-scrolled={forceScrolled ? "true" : undefined} className="fixed inset-x-0 top-0 z-50 border-b transition duration-300">
      <a href="#main-content" className="absolute left-4 top-3 -translate-y-20 bg-[#111318] px-4 py-2 text-sm font-bold text-white transition focus:translate-y-0">Skip to content</a>
      <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="/" className="flex items-center gap-3">
          <img src="/assets/u40-mark.svg" alt="" className="h-11 w-11" width="44" height="44" />
          <span>
            <span className="header-title block text-[15px] font-extrabold leading-none tracking-[-0.02em] transition-colors">U40 Academy Inn</span>
            <span className="header-subtitle mt-1.5 block font-mono text-[10px] font-medium uppercase tracking-[0.18em] transition-colors">Residential science institute</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={`/${item.href}`} className="header-nav-link text-sm font-semibold transition duration-200">{item.label}</a>
          ))}
        </nav>

        <a href="/#admissions" className="header-cta group hidden min-h-11 items-center gap-3 px-5 text-sm font-bold transition duration-200 active:scale-[0.98] lg:flex">
          Apply now <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
        </a>

        <button type="button" onClick={() => setOpen((value) => !value)} className="header-menu-btn grid h-11 w-11 cursor-pointer place-items-center border transition lg:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div id="mobile-menu" className={open ? "grid overflow-hidden bg-[#f7f6f2] transition-[grid-template-rows] duration-200 lg:hidden grid-rows-[1fr] border-t border-black/10" : "grid overflow-hidden bg-[#f7f6f2] transition-[grid-template-rows] duration-200 lg:hidden grid-rows-[0fr]"}>
        <div className="min-h-0">
          <nav className="px-5 py-4" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a key={item.href} href={`/${item.href}`} onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-between border-b border-black/10 text-base font-semibold text-[#111318]">
                {item.label}<ArrowUpRight className="h-4 w-4 text-[#2046d8]" />
              </a>
            ))}
            <a href="/#admissions" onClick={() => setOpen(false)} className="mt-5 flex min-h-12 items-center justify-between bg-[#2046d8] px-5 font-bold text-white">Apply for admission <ArrowUpRight className="h-4 w-4" /></a>
          </nav>
        </div>
      </div>
    </header>
  );
}
