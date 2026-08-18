import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { institute } from "@/data/institute";

export function Contact() {
  return (
    <section id="contact" className="bg-[#2046d8] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="page-grid gap-y-12">
          <div className="col-span-12 lg:col-span-7">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d9f66f]">Visit U40 Academy Inn</p>
            <h2 className="mt-5 max-w-[18ch] text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">See the campus. Meet the people.</h2>
          </div>
          <div className="col-span-12 flex flex-col justify-end lg:col-span-5">
            <div className="flex gap-4 border-t border-white/25 pt-6"><MapPin className="mt-1 h-5 w-5 shrink-0 text-[#d9f66f]" /><p className="max-w-md text-base leading-7 text-white/75">{institute.address}</p></div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={institute.mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Open directions in Google Maps (opens in new tab)" className="inline-flex min-h-12 items-center justify-center gap-2 bg-white px-5 text-sm font-bold text-[#2046d8] transition hover:bg-[#d9f66f]">Open directions <ArrowUpRight className="h-4 w-4" /></a>
              <a href={`tel:${institute.phones[0].replace(/\s/g, "")}`} className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/30 px-5 text-sm font-bold transition hover:bg-white/10"><Phone className="h-4 w-4" />{institute.phones[0]}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
