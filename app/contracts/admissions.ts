import { z } from "zod";

export const PRIVACY_NOTICE_VERSION = "2026-08-19";

export const COURSE_OPTIONS = [
  "Foundation Course — Class IX",
  "Foundation Course — Class X",
  "Foundation Level 1 — Class X Boards",
  "Foundation Level 2 — Class XI Boards",
  "Higher Secondary Science — XI & XII",
  "Medical — NEET",
  "Engineering — IIT-JEE",
  "Engineering — WBJEE",
] as const;

export const CLASS_OPTIONS = [
  "Class IX",
  "Class X",
  "Class XI",
  "Class XII",
  "Passed Class XII",
] as const;

export const BOARD_OPTIONS = [
  "WBBSE",
  "WBCHSE",
  "CBSE",
  "ICSE",
  "Other",
] as const;

function hasUnsupportedControlCharacters(value: string, allowLineBreaks: boolean) {
  return Array.from(value).some(character => {
    const code = character.charCodeAt(0);
    if (allowLineBreaks && (code === 9 || code === 10 || code === 13)) return false;
    return code < 32 || code === 127;
  });
}

const optionalText = (max: number, tooLongMessage: string) =>
  z
    .union([
      z
        .string()
        .trim()
        .max(max, tooLongMessage)
        .refine(
          value => !hasUnsupportedControlCharacters(value, true),
          "Remove unsupported control characters."
        ),
      z.literal(""),
    ])
    .optional()
    .transform(value => (value ? value : undefined));

const singleLineText = (min: number, max: number, minMessage: string, maxMessage: string) =>
  z
    .string()
    .trim()
    .min(min, minMessage)
    .max(max, maxMessage)
    .refine(value => !hasUnsupportedControlCharacters(value, false), {
      message: "Use a single line without control characters.",
    });

const optionalEmail = z
  .union([
    z
      .string()
      .trim()
      .max(254, "Email address must be 254 characters or fewer.")
      .email("Enter a valid email address, for example name@example.com."),
    z.literal(""),
  ])
  .optional()
  .transform(value => (value ? value : undefined));

const optionalDate = z
  .union([
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")
      .refine(value => {
        const [year, month, day] = value.split("-").map(Number);
        const date = new Date(Date.UTC(year!, month! - 1, day));
        const today = new Date();
        const todayUtc = Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate()
        );

        return (
          date.getUTCFullYear() === year &&
          date.getUTCMonth() === month! - 1 &&
          date.getUTCDate() === day &&
          date.getTime() <= todayUtc
        );
      }, "Choose a real date that is not in the future."),
    z.literal(""),
  ])
  .optional()
  .transform(value => (value ? value : undefined));

export const admissionInquirySchema = z.object({
  studentName: singleLineText(
    2,
    120,
    "Please enter the student's full name.",
    "Student name must be 120 characters or fewer."
  ),
  guardianName: singleLineText(
    2,
    120,
    "Please enter the parent or guardian's full name.",
    "Guardian name must be 120 characters or fewer."
  ),
  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9][0-9\s-]{8,15}$/,
      "Enter a valid phone number, for example +91 62966 17524."
    ),
  email: optionalEmail,
  dateOfBirth: optionalDate,
  currentClass: z.enum(CLASS_OPTIONS),
  courseInterested: z.enum(COURSE_OPTIONS),
  board: z.enum(BOARD_OPTIONS),
  schoolName: optionalText(160, "School name must be 160 characters or fewer."),
  previousPercentage: z
    .union([
      z
        .string()
        .trim()
        .regex(
          /^(?:100(?:\.0{1,2})?|(?:\d|[1-9]\d)(?:\.\d{1,2})?)%?$/,
          "Enter a percentage from 0 to 100."
        ),
      z.literal(""),
    ])
    .optional()
    .transform(value => (value ? value : undefined)),
  address: z
    .string()
    .trim()
    .min(
      10,
      "Please enter a complete residential address with town, district and PIN."
    )
    .max(700, "Residential address must be 700 characters or fewer.")
    .refine(
      value => !hasUnsupportedControlCharacters(value, true),
      "Remove unsupported control characters."
    ),
  message: optionalText(900, "Message must be 900 characters or fewer."),
  consent: z
    .boolean()
    .refine(
      value => value,
      "Please confirm consent before sending the inquiry."
    ),
  idempotencyKey: z.string().uuid("Refresh the form and try again."),
  turnstileToken: z
    .string()
    .min(1, "Complete the security check before sending the inquiry.")
    .max(2048, "The security check token is invalid."),
  website: z.string().max(0, "Unable to submit this inquiry.").optional(),
});

export type AdmissionInquiryConfirmation = {
  referenceCode: string;
  studentName: string;
  courseInterested: string;
};

export type AdmissionInquiryInput = z.infer<typeof admissionInquirySchema>;
