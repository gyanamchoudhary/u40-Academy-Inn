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

const optionalText = (max: number) =>
  z
    .union([z.string().trim().max(max), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined));

const optionalEmail = z
  .union([z.string().trim().email("Enter a valid email address"), z.literal("")])
  .optional()
  .transform((value) => (value ? value : undefined));

const optionalDate = z
  .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date"), z.literal("")])
  .optional()
  .transform((value) => (value ? value : undefined));

export const admissionInquirySchema = z.object({
  studentName: z.string().trim().min(2, "Student name is required").max(120),
  guardianName: z.string().trim().min(2, "Guardian name is required").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{8,15}$/, "Enter a valid phone number"),
  email: optionalEmail,
  dateOfBirth: optionalDate,
  currentClass: z.enum(CLASS_OPTIONS),
  courseInterested: z.enum(COURSE_OPTIONS),
  board: z.enum(BOARD_OPTIONS),
  schoolName: optionalText(160),
  previousPercentage: optionalText(20),
  address: z.string().trim().min(10, "Please enter the residential address").max(700),
  message: optionalText(900),
  consent: z.boolean().refine((value) => value, "Consent is required"),
});

export const trackApplicationSchema = z.object({
  referenceCode: z.string().trim().min(8, "Enter the full reference code").max(24),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{8,15}$/, "Enter the phone number used in the application"),
});

export const APPLICATION_STATUSES = [
  "submitted",
  "contacted",
  "under_review",
  "admitted",
  "closed",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type PublicAdmissionInquiry = {
  referenceCode: string;
  studentName: string;
  courseInterested: string;
  status: ApplicationStatus;
  phoneLast4: string;
  createdAt: Date;
};

export type AdmissionInquiryInput = z.infer<typeof admissionInquirySchema>;
export type TrackApplicationInput = z.infer<typeof trackApplicationSchema>;
