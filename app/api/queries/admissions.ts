import { admissionInquiries } from "@db/schema";
import type { AdmissionInquiryInput } from "@contracts/admissions";
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

  return {
    studentName: inquiry.studentName,
    courseInterested: inquiry.courseInterested,
  };
}
