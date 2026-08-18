import { z } from "zod";

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

const optionalText = (max: number, tooLongMessage: string) =>
  z
    .union([z.string().trim().max(max, tooLongMessage), z.literal("")])
    .optional()
    .transform(value => (value ? value : undefined));

const optionalEmail = z
  .union([
    z
      .string()
      .trim()
      .email("Enter a valid email address, for example name@example.com."),
    z.literal(""),
  ])
  .optional()
  .transform(value => (value ? value : undefined));

const optionalDate = z
  .union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date."),
    z.literal(""),
  ])
  .optional()
  .transform(value => (value ? value : undefined));

export const admissionInquirySchema = z.object({
  studentName: z
    .string()
    .trim()
    .min(2, "Please enter the student's full name.")
    .max(120, "Student name must be 120 characters or fewer."),
  guardianName: z
    .string()
    .trim()
    .min(2, "Please enter the parent or guardian's full name.")
    .max(120, "Guardian name must be 120 characters or fewer."),
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
  previousPercentage: optionalText(
    20,
    "Previous percentage must be 20 characters or fewer."
  ),
  address: z
    .string()
    .trim()
    .min(
      10,
      "Please enter a complete residential address with town, district and PIN."
    )
    .max(700, "Residential address must be 700 characters or fewer."),
  message: optionalText(900, "Message must be 900 characters or fewer."),
  consent: z
    .boolean()
    .refine(
      value => value,
      "Please confirm consent before sending the inquiry."
    ),
});

export type AdmissionInquiryConfirmation = {
  referenceCode: string;
  studentName: string;
  courseInterested: string;
};

export type AdmissionInquiryInput = z.infer<typeof admissionInquirySchema>;
