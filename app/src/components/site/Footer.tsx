import { ArrowUpRight } from "lucide-react";
import { institute, navItems } from "@/data/institute";

export function Footer() {
  return (
    <footer className="bg-[#111318] text-white">
      <div className="mx-auto max-w-[90rem] px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <a href="#top" className="inline-flex items-center gap-3"><img src="/assets/u40-mark.svg" alt="" className="h-12 w-12" width="48" height="48" /><span className="text-lg font-extrabold">U40 Academy Inn</span></a>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/50">Residential science education for Classes IX–XII, NEET, IIT-JEE and WBJEE aspirants in Malda, West Bengal.</p>
          </div>
          <nav className="grid grid-cols-2 gap-x-8 gap-y-3 self-start sm:grid-cols-3" aria-label="Footer navigation">
            {navItems.map((item) => <a key={item.href} href={item.href} className="text-sm font-medium text-white/65 transition hover:text-white">{item.label}</a>)}
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-5 border-t border-white/15 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {institute.name}. All rights reserved.</p>
          <div className="flex gap-5"><a href="#top" className="inline-flex items-center gap-2 text-white/70 hover:text-white">Back to top <ArrowUpRight className="h-3.5 w-3.5" /></a><a href="/privacy" className="hover:text-white">Privacy</a><a href="/terms" className="hover:text-white">Terms</a></div>
        </div>
      </div>
    </footer>
  );
}
