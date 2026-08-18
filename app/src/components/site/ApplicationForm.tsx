import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, PhoneCall, Send } from "lucide-react";
import {
  BOARD_OPTIONS,
  CLASS_OPTIONS,
  COURSE_OPTIONS,
  type AdmissionInquiryInput,
  type AdmissionInquiryConfirmation,
} from "@contracts/admissions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

type FormState = {
  studentName: string;
  guardianName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  currentClass: (typeof CLASS_OPTIONS)[number];
  courseInterested: (typeof COURSE_OPTIONS)[number];
  board: (typeof BOARD_OPTIONS)[number];
  schoolName: string;
  previousPercentage: string;
  address: string;
  message: string;
  consent: boolean;
};

const initialForm: FormState = {
  studentName: "",
  guardianName: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  currentClass: "Class X",
  courseInterested: "Medical — NEET",
  board: "WBBSE",
  schoolName: "",
  previousPercentage: "",
  address: "",
  message: "",
  consent: false,
};

function FieldLabel({ children, htmlFor, required = false }: { children: string; htmlFor: string; required?: boolean }) {
  return (
    <Label htmlFor={htmlFor} className="text-sm font-bold text-[#33373f]">
      {children} {required ? <span className="text-red-500">*</span> : null}
    </Label>
  );
}

export function ApplicationForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState<AdmissionInquiryConfirmation | null>(null);
  const [consentError, setConsentError] = useState(false);
  const submitInquiry = trpc.admission.submit.useMutation();

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === "consent" && value === true) setConsentError(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.consent) {
      setConsentError(true);
      return;
    }

    const payload: AdmissionInquiryInput = {
      ...form,
      phone: form.phone.trim(),
      email: form.email.trim(),
      schoolName: form.schoolName.trim(),
      previousPercentage: form.previousPercentage.trim(),
      message: form.message.trim(),
    };

    submitInquiry.mutate(payload, {
      onSuccess: (result) => {
        setSubmitted(result);
        setForm(initialForm);
      },
    });
  };

  if (submitted) {
    return (
      <div className="border border-black/15 bg-white p-7 sm:p-8" role="status" aria-live="polite">
        <span className="flex h-16 w-16 items-center justify-center bg-[#eef1ff] text-[#2046d8]">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h3 className="mt-7 text-3xl font-semibold tracking-[-0.04em] text-[#111318]">
          Inquiry received.
        </h3>
        <p className="mt-3 leading-7 text-slate-600">
          Thank you, {submitted.studentName}. Your {submitted.courseInterested} enquiry has been received. Our admissions team will call the guardian using the phone number provided in the form.
        </p>

        <div className="mt-7 flex items-start gap-4 bg-[#111318] p-6 text-white">
          <PhoneCall className="mt-0.5 h-6 w-6 shrink-0 text-[#d9f66f]" />
          <div>
            <p className="font-semibold">What happens next?</p>
            <p className="mt-2 text-sm leading-7 text-white/65">A counsellor will contact you to discuss the student’s programme, campus visit and admission requirements.</p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setSubmitted(null)}
          className="mt-6 border-slate-300 font-bold"
        >
          Submit another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="admission-form border border-black/15 bg-white p-5 sm:p-8"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2046d8]">
            Online admission inquiry
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#111318]">
            Reserve a counselling call.
          </h3>
        </div>
        <span className="bg-[#d9f66f] px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#111318]">Secure form</span>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel htmlFor="studentName" required>Student name</FieldLabel>
          <Input
            id="studentName"
            value={form.studentName}
            onChange={(event) => update("studentName", event.target.value)}
            placeholder="Enter full name"
            required
            autoComplete="name"
            className="h-12 border-slate-200 bg-white"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="guardianName" required>Guardian name</FieldLabel>
          <Input
            id="guardianName"
            value={form.guardianName}
            onChange={(event) => update("guardianName", event.target.value)}
            placeholder="Father / mother / guardian"
            required
            autoComplete="name"
            className="h-12 border-slate-200 bg-white"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="phone" required>Phone number</FieldLabel>
          <Input
            id="phone"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="+91 62966 17524"
            required
            inputMode="tel"
            autoComplete="tel"
            className="h-12 border-slate-200 bg-white"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="student@example.com"
            autoComplete="email"
            className="h-12 border-slate-200 bg-white"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="dateOfBirth">Date of birth</FieldLabel>
          <Input
            id="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={(event) => update("dateOfBirth", event.target.value)}
            autoComplete="bday"
            className="h-12 border-slate-200 bg-white"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="currentClass" required>Current class</FieldLabel>
          <Select
            value={form.currentClass}
            onValueChange={(value) => update("currentClass", value as FormState["currentClass"])}
          >
            <SelectTrigger id="currentClass" className="h-12 border-slate-200 bg-white data-[size=default]:h-12">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {CLASS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <FieldLabel htmlFor="courseInterested" required>Course interested in</FieldLabel>
          <Select
            value={form.courseInterested}
            onValueChange={(value) => update("courseInterested", value as FormState["courseInterested"])}
          >
            <SelectTrigger id="courseInterested" className="h-12 border-slate-200 bg-white data-[size=default]:h-12">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {COURSE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="board" required>Board</FieldLabel>
          <Select
            value={form.board}
            onValueChange={(value) => update("board", value as FormState["board"])}
          >
            <SelectTrigger id="board" className="h-12 border-slate-200 bg-white data-[size=default]:h-12">
              <SelectValue placeholder="Select board" />
            </SelectTrigger>
            <SelectContent>
              {BOARD_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="previousPercentage">Previous percentage</FieldLabel>
          <Input
            id="previousPercentage"
            value={form.previousPercentage}
            onChange={(event) => update("previousPercentage", event.target.value)}
            placeholder="Example: 85%"
            inputMode="decimal"
            className="h-12 border-slate-200 bg-white"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <FieldLabel htmlFor="schoolName">School name</FieldLabel>
          <Input
            id="schoolName"
            value={form.schoolName}
            onChange={(event) => update("schoolName", event.target.value)}
            placeholder="Last attended school"
            autoComplete="organization"
            className="h-12 border-slate-200 bg-white"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <FieldLabel htmlFor="address" required>Residential address</FieldLabel>
          <Textarea
            id="address"
            value={form.address}
            onChange={(event) => update("address", event.target.value)}
            placeholder="Village / town, post office, district, state and PIN"
            required
            autoComplete="street-address"
            className="min-h-24 border-slate-200 bg-white"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <FieldLabel htmlFor="message">Message for the admissions team</FieldLabel>
          <Textarea
            id="message"
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
            placeholder="Tell us about the student’s goals, preferred session or scholarship needs."
            className="min-h-24 border-slate-200 bg-white"
          />
        </div>
      </div>

      <label htmlFor="consent" className="mt-6 flex cursor-pointer items-start gap-3 border border-slate-200 bg-[#f7f6f2] p-4 text-sm leading-6 text-slate-600">
        <Checkbox
          id="consent"
          checked={form.consent}
          onCheckedChange={(checked) => update("consent", checked === true)}
          className="mt-1"
          aria-invalid={consentError}
          aria-describedby={consentError ? "consent-error" : undefined}
        />
        <span>
          I consent to U40 Academy Inn contacting me about this admission inquiry and understand that campus admission is completed only after document verification.
        </span>
      </label>

      {consentError ? (
        <p id="consent-error" className="mt-2 text-sm font-bold text-red-600" role="alert">
          Please confirm consent before submitting.
        </p>
      ) : null}

      {submitInquiry.error ? (
        <div role="alert" aria-live="assertive" className="mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          {submitInquiry.error.message}
        </div>
      ) : null}

        <Button
          type="submit"
          disabled={submitInquiry.isPending}
          className="mt-7 h-14 w-full bg-[#2046d8] text-base font-bold text-white hover:bg-[#1737ae]"
        >
        {submitInquiry.isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Saving inquiry…
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Submit admission inquiry
          </>
        )}
      </Button>
    </form>
  );
}
