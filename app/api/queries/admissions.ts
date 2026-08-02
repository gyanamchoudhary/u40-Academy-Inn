import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { admissionInquiries, type AdmissionInquiry } from "@db/schema";
import type {
  AdmissionInquiryInput,
  PublicAdmissionInquiry,
} from "@contracts/admissions";
import { getDb } from "./connection";

function generateReferenceCode() {
  const year = new Date().getFullYear();
  const suffix = randomBytes(4).toString("hex").toUpperCase();
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

export async function createAdmissionInquiry(input: AdmissionInquiryInput) {
  const { consent: _consent, ...details } = input;
  const db = getDb();
  const referenceCode = generateReferenceCode();

  const [{ id }] = await db
    .insert(admissionInquiries)
    .values({
      ...details,
      referenceCode,
    })
    .$returningId();

  const inquiry = await db.query.admissionInquiries.findFirst({
    where: eq(admissionInquiries.id, id),
  });

  if (!inquiry) {
    throw new Error("Admission inquiry could not be saved");
  }

  return toPublicInquiry(inquiry);
}

export async function findAdmissionInquiryForTracking(
  referenceCode: string,
  phone: string,
) {
  const inquiry = await getDb().query.admissionInquiries.findFirst({
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
