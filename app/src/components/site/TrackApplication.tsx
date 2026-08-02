import { useState, type FormEvent } from "react";
import { Loader2, SearchCheck } from "lucide-react";
import type { ApplicationStatus, PublicAdmissionInquiry } from "@contracts/admissions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/providers/trpc";

const statusMeta: Record<ApplicationStatus, { label: string; className: string; note: string }> = {
  submitted: {
    label: "Submitted",
    className: "bg-sky-100 text-sky-800",
    note: "Your inquiry has been received and is waiting for the admissions team.",
  },
  contacted: {
    label: "Contacted",
    className: "bg-violet-100 text-violet-800",
    note: "The admissions team has reached out to the guardian.",
  },
  under_review: {
    label: "Under review",
    className: "bg-amber-100 text-amber-800",
    note: "Your academic details and documents are being reviewed.",
  },
  admitted: {
    label: "Admitted",
    className: "bg-emerald-100 text-emerald-800",
    note: "Congratulations — the admission has been confirmed.",
  },
  closed: {
    label: "Closed",
    className: "bg-slate-200 text-slate-700",
    note: "This inquiry is no longer active. Please contact admissions for help.",
  },
};

export function TrackApplication() {
  const utils = trpc.useUtils();
  const [referenceCode, setReferenceCode] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<PublicAdmissionInquiry | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const inquiry = await utils.admission.track.fetch({
        referenceCode: referenceCode.trim(),
        phone: phone.trim(),
      });
      setResult(inquiry);
    } catch (trackError) {
      setError(
        trackError instanceof Error
          ? trackError.message
          : "Unable to track the application right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] bg-[#07142c] p-6 text-white shadow-2xl shadow-slate-950/20 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-300 text-slate-950">
          <SearchCheck className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-lime-300">
            Track application
          </p>
          <h3 className="mt-2 font-display text-3xl font-black tracking-tight">
            Already submitted?
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Enter your reference code and the registered phone number to check the live admission status.
          </p>
        </div>
      </div>

      <form onSubmit={handleTrack} className="mt-7 space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-black text-slate-200">Reference code</Label>
          <Input
            value={referenceCode}
            onChange={(event) => setReferenceCode(event.target.value.toUpperCase())}
            placeholder="U40-2026-XXXXXXXX"
            required
            className="h-12 rounded-2xl border-white/10 bg-white/10 font-mono text-white placeholder:text-slate-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-black text-slate-200">Registered phone</Label>
          <Input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone used in the form"
            required
            inputMode="tel"
            className="h-12 rounded-2xl border-white/10 bg-white/10 text-white placeholder:text-slate-500"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-full bg-yellow-300 font-black text-slate-950 hover:bg-lime-300"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking…
            </>
          ) : (
            "Check status"
          )}
        </Button>
      </form>

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm font-bold leading-6 text-red-100">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                {result.referenceCode}
              </p>
              <h4 className="mt-2 text-xl font-black">{result.studentName}</h4>
            </div>
            <Badge className={`${statusMeta[result.status].className} rounded-full px-4 py-1.5 font-black hover:bg-current`}>
              {statusMeta[result.status].label}
            </Badge>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">{statusMeta[result.status].note}</p>
          <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 text-sm text-slate-300">
            <p>
              <span className="font-black text-white">Course:</span> {result.courseInterested}
            </p>
            <p>
              <span className="font-black text-white">Submitted:</span>{" "}
              {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(result.createdAt)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
