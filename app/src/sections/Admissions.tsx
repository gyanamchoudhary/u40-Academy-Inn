import { Check, FileText, Phone } from "lucide-react";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TRPCProvider } from "@/providers/trpc";
import { admissionSteps, institute, requiredDocuments } from "@/data/institute";

export function Admissions() {
  return (
    <section id="admissions" className="bg-[#f7f6f2] py-20 sm:py-28 lg:py-32">
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

              <a href={`tel:${institute.phones[0].replace(/\s/g, "")}`} className="mt-7 flex min-h-14 items-center justify-center gap-3 bg-[#d9f66f] px-4 text-center text-sm font-bold text-[#111318] transition hover:bg-[#c7ea4e] active:bg-[#c7ea4e] sm:justify-start sm:gap-4 sm:px-5 sm:text-left">
                <Phone className="h-5 w-5" /> Speak to admissions · {institute.phones[0]}
              </a>

              <details className="mt-4 border border-black/15 bg-white p-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 font-bold"><FileText className="h-5 w-5 text-[#2046d8]" /> Documents to bring</summary>
                <ul className="mt-5 space-y-3">
                  {requiredDocuments.map((document) => <li key={document} className="flex gap-2 text-sm leading-6 text-[#60646c]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#2046d8]" />{document}</li>)}
                </ul>
              </details>
            </div>
          </aside>

          <div className="admission-shell col-span-12 lg:col-span-8 lg:pl-10">
            <TRPCProvider>
              <ApplicationForm />
            </TRPCProvider>
          </div>
        </div>

      </div>
    </section>
  );
}
