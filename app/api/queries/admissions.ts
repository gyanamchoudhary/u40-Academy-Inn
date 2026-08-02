import { eq } from "drizzle-orm";
import { admissionInquiries, type AdmissionInquiry } from "@db/schema";
import type {
  AdmissionInquiryInput,
  PublicAdmissionInquiry,
} from "@contracts/admissions";
import type { Database } from "./connection";

function generateReferenceCode() {
  const year = new Date().getFullYear();
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) =>
    b.toString(16).padStart(2, "0"),
  )
    .join("")
    .toUpperCase();
  return `U40-${year}-${suffix}`;
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function toPublicInquiry(inquiry: AdmissionInquiry): PublicAdmissionInquiry {
  const digits = normalizePhone(inquiry.phone);

  return {
    referenceCode: inquiry.referenceCode,
    studentName: inquiry.studentName,
    courseInterested: inquiry.courseInterested,
    status: inquiry.status,
    phoneLast4: digits.slice(-4),
    createdAt: inquiry.createdAt,
  };
}

export async function createAdmissionInquiry(
  db: Database,
  input: AdmissionInquiryInput,
) {
  const { consent: _consent, ...details } = input;
  const referenceCode = generateReferenceCode();

  const [inquiry] = await db
    .insert(admissionInquiries)
    .values({
      ...details,
      referenceCode,
    })
    .returning();

  if (!inquiry) {
    throw new Error("Admission inquiry could not be saved");
  }

  return toPublicInquiry(inquiry);
}

export async function findAdmissionInquiryForTracking(
  db: Database,
  referenceCode: string,
  phone: string,
) {
  const inquiry = await db.query.admissionInquiries.findFirst({
    where: eq(admissionInquiries.referenceCode, referenceCode.trim().toUpperCase()),
  });

  if (!inquiry) {
    return null;
  }

  const storedPhone = normalizePhone(inquiry.phone).slice(-10);
  const suppliedPhone = normalizePhone(phone).slice(-10);

  if (!storedPhone || storedPhone !== suppliedPhone) {
    return null;
  }

  return toPublicInquiry(inquiry);
}
