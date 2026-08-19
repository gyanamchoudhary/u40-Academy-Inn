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
  idempotencyKey: "123e4567-e89b-42d3-a456-426614174000",
  turnstileToken: "test-turnstile-token",
  website: "",
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

  it("rejects impossible and future dates", () => {
    for (const dateOfBirth of ["2026-99-99", "2099-01-01"]) {
      expect(
        admissionInquirySchema.safeParse({ ...validInquiry, dateOfBirth }).success
      ).toBe(false);
    }
  });

  it("rejects control characters in names and a filled honeypot", () => {
    expect(
      admissionInquirySchema.safeParse({
        ...validInquiry,
        studentName: "Anik\r\nInjected",
      }).success
    ).toBe(false);
    expect(
      admissionInquirySchema.safeParse({ ...validInquiry, website: "bot" }).success
    ).toBe(false);
    expect(
      admissionInquirySchema.safeParse({
        ...validInquiry,
        address: "Malda, West Bengal\u0000 732103",
      }).success
    ).toBe(false);
  });

  it("strips unexpected properties", () => {
    const result = admissionInquirySchema.safeParse({
      ...validInquiry,
      role: "admin",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).not.toHaveProperty("role");
  });
});
