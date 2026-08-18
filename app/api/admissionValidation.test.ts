import { describe, expect, it } from "vitest";
import { admissionInquirySchema } from "@contracts/admissions";

const validInquiry = {
  studentName: "Anik Das",
  guardianName: "Samar Das",
  phone: "+91 90000 00000",
  email: "",
  dateOfBirth: "",
  currentClass: "Class X",
  courseInterested: "Medical — NEET",
  board: "WBBSE",
  schoolName: "New Bharti",
  previousPercentage: "",
  address: "Malda, West Bengal 732103",
  message: "",
  consent: true,
} as const;

describe("admission inquiry validation messages", () => {
  it("gives a clear instruction for an incomplete address", () => {
    const result = admissionInquirySchema.safeParse({
      ...validInquiry,
      address: "dsaf",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Please enter a complete residential address with town, district and PIN."
      );
    }
  });

  it("gives an example when the email format is invalid", () => {
    const result = admissionInquirySchema.safeParse({
      ...validInquiry,
      email: "student-at-example.com",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("name@example.com");
    }
  });
});
