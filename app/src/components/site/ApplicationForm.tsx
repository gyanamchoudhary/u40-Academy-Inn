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
import { trpc } from "@/providers/trpc";

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

function FieldLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <Label className="text-sm font-bold text-[#33373f]">
      {children} {required ? <span className="text-red-500">*</span> : null}
    </Label>
  );
}

export function ApplicationForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState<AdmissionInquiryConfirmation | null>(null);
  const submitInquiry = trpc.admission.submit.useMutation();

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      <div className="border border-black/15 bg-white p-7 sm:p-8">
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
          className="mt-6 rounded-none border-slate-300 font-bold"
        >
          Submit another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="admission-form border border-black/15 bg-white p-6 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2046d8]">
            Online admission inquiry
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#111318]">
            Reserve a counselling call.
          </h3>
        </div>
        <span className="bg-[#d9f66f] px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#111318]">Secure form</span>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel required>Student name</FieldLabel>
          <Input
            value={form.studentName}
            onChange={(event) => update("studentName", event.target.value)}
            placeholder="Enter full name"
            required
            className="h-12 rounded-2xl border-slate-200 bg-slate-50"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel required>Guardian name</FieldLabel>
          <Input
            value={form.guardianName}
            onChange={(event) => update("guardianName", event.target.value)}
            placeholder="Father / mother / guardian"
            required
            className="h-12 rounded-2xl border-slate-200 bg-slate-50"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel required>Phone number</FieldLabel>
          <Input
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="+91 62966 17524"
            required
            inputMode="tel"
            className="h-12 rounded-2xl border-slate-200 bg-slate-50"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Email address</FieldLabel>
          <Input
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="student@example.com"
            className="h-12 rounded-2xl border-slate-200 bg-slate-50"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Date of birth</FieldLabel>
          <Input
            type="date"
            value={form.dateOfBirth}
            onChange={(event) => update("dateOfBirth", event.target.value)}
            className="h-12 rounded-2xl border-slate-200 bg-slate-50"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel required>Current class</FieldLabel>
          <Select
            value={form.currentClass}
            onValueChange={(value) => update("currentClass", value as FormState["currentClass"])}
          >
            <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
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
          <FieldLabel required>Course interested in</FieldLabel>
          <Select
            value={form.courseInterested}
            onValueChange={(value) => update("courseInterested", value as FormState["courseInterested"])}
          >
            <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
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
          <FieldLabel required>Board</FieldLabel>
          <Select
            value={form.board}
            onValueChange={(value) => update("board", value as FormState["board"])}
          >
            <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
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
          <FieldLabel>Previous percentage</FieldLabel>
          <Input
            value={form.previousPercentage}
            onChange={(event) => update("previousPercentage", event.target.value)}
            placeholder="Example: 85%"
            className="h-12 rounded-2xl border-slate-200 bg-slate-50"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <FieldLabel>School name</FieldLabel>
          <Input
            value={form.schoolName}
            onChange={(event) => update("schoolName", event.target.value)}
            placeholder="Last attended school"
            className="h-12 rounded-2xl border-slate-200 bg-slate-50"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <FieldLabel required>Residential address</FieldLabel>
          <Textarea
            value={form.address}
            onChange={(event) => update("address", event.target.value)}
            placeholder="Village / town, post office, district, state and PIN"
            required
            className="min-h-24 rounded-2xl border-slate-200 bg-slate-50"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <FieldLabel>Message for the admissions team</FieldLabel>
          <Textarea
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
            placeholder="Tell us about the student’s goals, preferred session or scholarship needs."
            className="min-h-24 rounded-2xl border-slate-200 bg-slate-50"
          />
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 border border-slate-200 bg-[#f7f6f2] p-4 text-sm leading-6 text-slate-600">
        <Checkbox
          checked={form.consent}
          onCheckedChange={(checked) => update("consent", checked === true)}
          className="mt-1"
          required
        />
        <span>
          I consent to U40 Academy Inn contacting me about this admission inquiry and understand that campus admission is completed only after document verification.
        </span>
      </label>

      {submitInquiry.error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          {submitInquiry.error.message}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={submitInquiry.isPending}
        className="mt-7 h-14 w-full rounded-none bg-[#2046d8] text-base font-bold text-white hover:bg-[#1737ae]"
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
