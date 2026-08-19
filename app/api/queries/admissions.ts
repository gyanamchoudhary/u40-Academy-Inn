import { admissionInquiries } from "@db/schema";
import { eq } from "drizzle-orm";
import {
  PRIVACY_NOTICE_VERSION,
  type AdmissionInquiryInput,
} from "@contracts/admissions";
import type { Database } from "./connection";

export function generateReferenceCode() {
  const year = new Date().getFullYear();
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, b => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `U40-${year}-${suffix}`;
}

export async function createAdmissionInquiry(
  db: Database,
  input: AdmissionInquiryInput
) {
  const { idempotencyKey } = input;
  const details = {
    studentName: input.studentName,
    guardianName: input.guardianName,
    phone: input.phone,
    email: input.email,
    dateOfBirth: input.dateOfBirth,
    currentClass: input.currentClass,
    courseInterested: input.courseInterested,
    board: input.board,
    schoolName: input.schoolName,
    previousPercentage: input.previousPercentage,
    address: input.address,
    message: input.message,
  };
  const referenceCode = generateReferenceCode();

  const [inserted] = await db
    .insert(admissionInquiries)
    .values({
      ...details,
      referenceCode,
      idempotencyKey,
      consentAt: new Date(),
      privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
    })
    .onConflictDoNothing({ target: admissionInquiries.idempotencyKey })
    .returning();

  const inquiry =
    inserted ??
    (
      await db
        .select()
        .from(admissionInquiries)
        .where(eq(admissionInquiries.idempotencyKey, idempotencyKey))
        .limit(1)
    )[0];

  if (!inquiry) {
    throw new Error("Admission inquiry could not be saved");
  }

  return {
    confirmation: {
      referenceCode: inquiry.referenceCode,
      studentName: inquiry.studentName,
      courseInterested: inquiry.courseInterested,
    },
    created: Boolean(inserted),
  };
}
