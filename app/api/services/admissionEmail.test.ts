import { describe, expect, it, vi } from "vitest";
import type { AdmissionInquiryInput } from "@contracts/admissions";
import {
  createAdmissionEmail,
  sendAdmissionInquiryNotification,
} from "./admissionEmail";

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
  idempotencyKey: "123e4567-e89b-42d3-a456-426614174000",
  turnstileToken: "test-turnstile-token",
  website: "",
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

  it("keeps detailed personal data out of the notification", () => {
    const email = createAdmissionEmail(inquiry, "U40-2026-ABC12345");

    expect(email.text).not.toContain("Date of birth");
    expect(email.text).not.toContain("Residential address");
    expect(email.text).not.toContain("Message:");
  });

  it("prevents line breaks in the email subject", () => {
    const email = createAdmissionEmail(
      { ...inquiry, studentName: "Anik\r\nBcc audit@example.com" },
      "U40-2026-ABC12345"
    );

    expect(email.subject).not.toContain("\r");
    expect(email.subject).not.toContain("\n");
  });

  it("sends every notification to the configured admissions mailbox", async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const binding = { send } as unknown as SendEmail;

    await sendAdmissionInquiryNotification(
      binding,
      inquiry,
      "U40-2026-ABC12345"
    );

    expect(send).toHaveBeenCalledOnce();
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ to: "u40academyadmission@gmail.com" })
    );
  });
});
