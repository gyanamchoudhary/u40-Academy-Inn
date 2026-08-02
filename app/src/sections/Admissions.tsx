import { Check, FileText, Phone } from "lucide-react";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TrackApplication } from "@/components/site/TrackApplication";
import { admissionSteps, institute, requiredDocuments } from "@/data/institute";

export function Admissions() {
  return (
    <section id="admissions" className="bg-[#f7f6f2] py-24 sm:py-32">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="page-grid gap-y-12">
          <aside className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading eyebrow="Admissions" title="Take the first step toward a residential seat." description="Send an inquiry to reserve a counselling call. This is not a fee payment or final admission." />

              <ol className="mt-10 border-t border-black/15">
                {admissionSteps.map((step, index) => (
                  <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-black/15 py-4">
                    <span className="font-mono text-xs font-semibold text-[#2046d8]">0{index + 1}</span>
                    <p className="text-sm leading-6 text-[#555b66]">{step}</p>
                  </li>
                ))}
              </ol>

              <a href={`tel:${institute.phones[0].replace(/\s/g, "")}`} className="mt-7 flex min-h-14 items-center gap-4 bg-[#d9f66f] px-5 text-sm font-bold text-[#111318] transition hover:bg-[#c7ea4e]">
                <Phone className="h-5 w-5" /> Speak to admissions · {institute.phones[0]}
              </a>

              <details className="mt-4 border border-black/15 bg-white p-5">
                <summary className="flex cursor-pointer list-none items-center gap-3 font-bold"><FileText className="h-5 w-5 text-[#2046d8]" /> Documents to bring</summary>
                <ul className="mt-5 space-y-3">
                  {requiredDocuments.map((document) => <li key={document} className="flex gap-2 text-sm leading-6 text-[#60646c]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#2046d8]" />{document}</li>)}
                </ul>
              </details>
            </div>
          </aside>

          <div className="admission-shell col-span-12 lg:col-span-8 lg:pl-10">
            <ApplicationForm />
          </div>
        </div>

        <div className="mt-16 grid items-start gap-8 border-t border-black/15 pt-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div><p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2046d8]">Already applied?</p><h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Track an existing inquiry.</h3><p className="mt-4 max-w-md text-sm leading-7 text-[#60646c]">Use the reference code from your confirmation and the registered phone number.</p></div>
          <div className="track-shell"><TrackApplication /></div>
        </div>
      </div>
    </section>
  );
}
