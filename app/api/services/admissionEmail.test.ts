import { describe, expect, it } from "vitest";
import type { AdmissionInquiryInput } from "@contracts/admissions";
import { createAdmissionEmail } from "./admissionEmail";

const inquiry: AdmissionInquiryInput = {
  studentName: "Anik <script>",
  guardianName: "Parent Name",
  phone: "+91 90000 00000",
  email: "student@example.com",
  dateOfBirth: undefined,
  currentClass: "Class X",
  courseInterested: "Medical — NEET",
  board: "WBBSE",
  schoolName: undefined,
  previousPercentage: undefined,
  address: "Malda, West Bengal 732103",
  message: "Please call after 5 PM",
  consent: true,
};

describe("admission notification email", () => {
  it("includes the inquiry reference and all important contact details", () => {
    const email = createAdmissionEmail(inquiry, "U40-2026-ABC12345");

    expect(email.subject).toContain("U40-2026-ABC12345");
    expect(email.text).toContain("+91 90000 00000");
    expect(email.text).toContain("Medical — NEET");
  });

  it("escapes visitor-supplied HTML in the rich email", () => {
    const email = createAdmissionEmail(inquiry, "U40-2026-ABC12345");

    expect(email.html).toContain("Anik &lt;script&gt;");
    expect(email.html).not.toContain("Anik <script>");
  });
});
