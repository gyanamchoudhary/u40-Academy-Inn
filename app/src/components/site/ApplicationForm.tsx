import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, PhoneCall, Send } from "lucide-react";
import {
  BOARD_OPTIONS,
  CLASS_OPTIONS,
  COURSE_OPTIONS,
  admissionInquirySchema,
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

type FieldErrors = Partial<Record<keyof FormState, string>>;

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

function FieldLabel({
  children,
  htmlFor,
  required = false,
}: {
  children: string;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <Label htmlFor={htmlFor} className="text-sm font-bold text-[#33373f]">
      {children} {required ? <span className="text-red-500">*</span> : null}
    </Label>
  );
}

function FieldError({
  field,
  message,
}: {
  field: keyof FormState;
  message?: string;
}) {
  if (!message) return null;

  return (
    <p
      id={`${field}-error`}
      className="text-sm font-semibold leading-5 text-red-700"
    >
      {message}
    </p>
  );
}

export function ApplicationForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] =
    useState<AdmissionInquiryConfirmation | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const submitInquiry = trpc.admission.submit.useMutation();

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(current => ({ ...current, [field]: value }));
    setFieldErrors(current => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (submitInquiry.error) submitInquiry.reset();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      ...form,
      phone: form.phone.trim(),
      email: form.email.trim(),
      schoolName: form.schoolName.trim(),
      previousPercentage: form.previousPercentage.trim(),
      message: form.message.trim(),
    };

    const validation = admissionInquirySchema.safeParse(payload);

    if (!validation.success) {
      const nextErrors: FieldErrors = {};

      for (const issue of validation.error.issues) {
        const field = issue.path[0] as keyof FormState | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }

      setFieldErrors(nextErrors);
      submitInquiry.reset();

      const firstField = validation.error.issues[0]?.path[0];
      if (typeof firstField === "string") {
        requestAnimationFrame(() =>
          document.getElementById(firstField)?.focus()
        );
      }
      return;
    }

    setFieldErrors({});
    submitInquiry.mutate(validation.data, {
      onSuccess: result => {
        setSubmitted(result);
        setForm(initialForm);
        setFieldErrors({});
      },
    });
  };

  if (submitted) {
    return (
      <div
        className="border border-black/15 bg-white p-7 sm:p-8"
        role="status"
        aria-live="polite"
      >
        <span className="flex h-16 w-16 items-center justify-center bg-[#eef1ff] text-[#2046d8]">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h3 className="mt-7 text-3xl font-semibold tracking-[-0.04em] text-[#111318]">
          Inquiry received.
        </h3>
        <p className="mt-3 leading-7 text-slate-600">
          Thank you, {submitted.studentName}. Your {submitted.courseInterested}{" "}
          enquiry has been received. Our admissions team will call the guardian
          using the phone number provided in the form.
        </p>

        <div className="mt-5 border border-[#2046d8]/20 bg-[#eef1ff] px-5 py-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2046d8]">
            Inquiry reference
          </p>
          <p className="mt-1 font-mono text-sm font-bold text-[#111318]">
            {submitted.referenceCode}
          </p>
        </div>

        <div className="mt-7 flex items-start gap-4 bg-[#111318] p-6 text-white">
          <PhoneCall className="mt-0.5 h-6 w-6 shrink-0 text-[#d9f66f]" />
          <div>
            <p className="font-semibold">What happens next?</p>
            <p className="mt-2 text-sm leading-7 text-white/65">
              A counsellor will contact you to discuss the student’s programme,
              campus visit and admission requirements.
            </p>
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
      noValidate
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
        <span className="bg-[#d9f66f] px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#111318]">
          Secure form
        </span>
      </div>

      {Object.keys(fieldErrors).length > 0 ? (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-6 border border-red-300 bg-red-50 px-5 py-4 text-red-900"
        >
          <p className="font-bold">Please check the highlighted details.</p>
          <p className="mt-1 text-sm leading-6">
            We have not sent the inquiry yet. Each highlighted field explains
            what to fix.
          </p>
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel htmlFor="studentName" required>
            Student name
          </FieldLabel>
          <Input
            id="studentName"
            value={form.studentName}
            onChange={event => update("studentName", event.target.value)}
            placeholder="Enter full name"
            required
            autoComplete="name"
            className="h-12 border-slate-200 bg-white"
            aria-invalid={Boolean(fieldErrors.studentName)}
            aria-describedby={
              fieldErrors.studentName ? "studentName-error" : undefined
            }
          />
          <FieldError field="studentName" message={fieldErrors.studentName} />
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="guardianName" required>
            Guardian name
          </FieldLabel>
          <Input
            id="guardianName"
            value={form.guardianName}
            onChange={event => update("guardianName", event.target.value)}
            placeholder="Father / mother / guardian"
            required
            autoComplete="name"
            className="h-12 border-slate-200 bg-white"
            aria-invalid={Boolean(fieldErrors.guardianName)}
            aria-describedby={
              fieldErrors.guardianName ? "guardianName-error" : undefined
            }
          />
          <FieldError field="guardianName" message={fieldErrors.guardianName} />
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="phone" required>
            Phone number
          </FieldLabel>
          <Input
            id="phone"
            value={form.phone}
            onChange={event => update("phone", event.target.value)}
            placeholder="+91 62966 17524"
            required
            inputMode="tel"
            autoComplete="tel"
            className="h-12 border-slate-200 bg-white"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
          />
          <FieldError field="phone" message={fieldErrors.phone} />
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={event => update("email", event.target.value)}
            placeholder="student@example.com"
            autoComplete="email"
            className="h-12 border-slate-200 bg-white"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          <FieldError field="email" message={fieldErrors.email} />
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="dateOfBirth">Date of birth</FieldLabel>
          <Input
            id="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={event => update("dateOfBirth", event.target.value)}
            autoComplete="bday"
            className="h-12 border-slate-200 bg-white"
            aria-invalid={Boolean(fieldErrors.dateOfBirth)}
            aria-describedby={
              fieldErrors.dateOfBirth ? "dateOfBirth-error" : undefined
            }
          />
          <FieldError field="dateOfBirth" message={fieldErrors.dateOfBirth} />
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="currentClass" required>
            Current class
          </FieldLabel>
          <Select
            value={form.currentClass}
            onValueChange={value =>
              update("currentClass", value as FormState["currentClass"])
            }
          >
            <SelectTrigger
              id="currentClass"
              className="h-12 border-slate-200 bg-white data-[size=default]:h-12"
            >
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {CLASS_OPTIONS.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <FieldLabel htmlFor="courseInterested" required>
            Course interested in
          </FieldLabel>
          <Select
            value={form.courseInterested}
            onValueChange={value =>
              update("courseInterested", value as FormState["courseInterested"])
            }
          >
            <SelectTrigger
              id="courseInterested"
              className="h-12 border-slate-200 bg-white data-[size=default]:h-12"
            >
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {COURSE_OPTIONS.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="board" required>
            Board
          </FieldLabel>
          <Select
            value={form.board}
            onValueChange={value =>
              update("board", value as FormState["board"])
            }
          >
            <SelectTrigger
              id="board"
              className="h-12 border-slate-200 bg-white data-[size=default]:h-12"
            >
              <SelectValue placeholder="Select board" />
            </SelectTrigger>
            <SelectContent>
              {BOARD_OPTIONS.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="previousPercentage">
            Previous percentage
          </FieldLabel>
          <Input
            id="previousPercentage"
            value={form.previousPercentage}
            onChange={event => update("previousPercentage", event.target.value)}
            placeholder="Example: 85%"
            inputMode="decimal"
            className="h-12 border-slate-200 bg-white"
            aria-invalid={Boolean(fieldErrors.previousPercentage)}
            aria-describedby={
              fieldErrors.previousPercentage
                ? "previousPercentage-error"
                : undefined
            }
          />
          <FieldError
            field="previousPercentage"
            message={fieldErrors.previousPercentage}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <FieldLabel htmlFor="schoolName">School name</FieldLabel>
          <Input
            id="schoolName"
            value={form.schoolName}
            onChange={event => update("schoolName", event.target.value)}
            placeholder="Last attended school"
            autoComplete="organization"
            className="h-12 border-slate-200 bg-white"
            aria-invalid={Boolean(fieldErrors.schoolName)}
            aria-describedby={
              fieldErrors.schoolName ? "schoolName-error" : undefined
            }
          />
          <FieldError field="schoolName" message={fieldErrors.schoolName} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <FieldLabel htmlFor="address" required>
            Residential address
          </FieldLabel>
          <Textarea
            id="address"
            value={form.address}
            onChange={event => update("address", event.target.value)}
            placeholder="Village / town, post office, district, state and PIN"
            required
            minLength={10}
            autoComplete="street-address"
            className="min-h-24 border-slate-200 bg-white"
            aria-invalid={Boolean(fieldErrors.address)}
            aria-describedby={fieldErrors.address ? "address-error" : undefined}
          />
          <FieldError field="address" message={fieldErrors.address} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <FieldLabel htmlFor="message">
            Message for the admissions team
          </FieldLabel>
          <Textarea
            id="message"
            value={form.message}
            onChange={event => update("message", event.target.value)}
            placeholder="Tell us about the student’s goals, preferred session or scholarship needs."
            className="min-h-24 border-slate-200 bg-white"
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? "message-error" : undefined}
          />
          <FieldError field="message" message={fieldErrors.message} />
        </div>
      </div>

      <label
        htmlFor="consent"
        className="mt-6 flex cursor-pointer items-start gap-3 border border-slate-200 bg-[#f7f6f2] p-4 text-sm leading-6 text-slate-600"
      >
        <Checkbox
          id="consent"
          checked={form.consent}
          onCheckedChange={checked => update("consent", checked === true)}
          className="mt-1"
          aria-invalid={Boolean(fieldErrors.consent)}
          aria-describedby={fieldErrors.consent ? "consent-error" : undefined}
        />
        <span>
          I consent to U40 Academy Inn contacting me about this admission
          inquiry and understand that campus admission is completed only after
          document verification.
        </span>
      </label>

      {fieldErrors.consent ? (
        <p
          id="consent-error"
          className="mt-2 text-sm font-bold text-red-600"
          role="alert"
        >
          {fieldErrors.consent}
        </p>
      ) : null}

      {submitInquiry.error ? (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700"
        >
          <p className="font-bold">We could not send your inquiry.</p>
          <p className="mt-1 font-normal leading-6">
            Check your internet connection and try again. If the problem
            continues, call admissions at +91 62966 17524.
          </p>
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
