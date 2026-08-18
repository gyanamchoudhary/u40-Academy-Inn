import type { AdmissionInquiryInput } from "@contracts/admissions";

const NOTIFICATION_DESTINATION = "contact@vardex.in";
const PUBLIC_CONTACT_ADDRESS = "contact@u40academy.com";
const NOTIFICATION_SENDER = "admissions@u40academy.com";

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    character =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#039;",
        '"': "&quot;",
      })[character] ?? character
  );
}

function display(value?: string) {
  return value?.trim() || "Not provided";
}

const fields: Array<{
  label: string;
  value: (input: AdmissionInquiryInput) => string | undefined;
}> = [
  { label: "Student name", value: input => input.studentName },
  { label: "Guardian name", value: input => input.guardianName },
  { label: "Phone", value: input => input.phone },
  { label: "Email", value: input => input.email },
  { label: "Date of birth", value: input => input.dateOfBirth },
  { label: "Current class", value: input => input.currentClass },
  { label: "Course", value: input => input.courseInterested },
  { label: "Board", value: input => input.board },
  { label: "Previous percentage", value: input => input.previousPercentage },
  { label: "School", value: input => input.schoolName },
  { label: "Residential address", value: input => input.address },
  { label: "Message", value: input => input.message },
];

export function createAdmissionEmail(
  input: AdmissionInquiryInput,
  referenceCode: string
) {
  const rows = fields
    .map(({ label, value }) => {
      const safeLabel = escapeHtml(label);
      const safeValue = escapeHtml(display(value(input))).replace(
        /\n/g,
        "<br />"
      );
      return `<tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#64748b;font-size:13px;vertical-align:top;width:34%">${safeLabel}</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#111318;font-size:14px;line-height:1.6">${safeValue}</td></tr>`;
    })
    .join("");

  const textDetails = fields
    .map(({ label, value }) => `${label}: ${display(value(input))}`)
    .join("\n");

  return {
    subject: `[${referenceCode}] New admission inquiry — ${input.studentName}`,
    text: [
      "A new admission inquiry was submitted on u40academy.com.",
      "",
      `Reference: ${referenceCode}`,
      textDetails,
      "",
      "This inquiry has also been saved in the U40 admissions database.",
    ].join("\n"),
    html: `<!doctype html><html><body style="margin:0;background:#f7f6f2;font-family:Arial,Helvetica,sans-serif;color:#111318"><div style="max-width:680px;margin:0 auto;padding:32px 16px"><div style="background:#2046d8;padding:24px 28px;color:#fff"><div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#d9f66f;font-weight:700">U40 Academy Inn</div><h1 style="margin:10px 0 0;font-size:24px;line-height:1.25">New admission inquiry</h1><p style="margin:8px 0 0;color:#dbe4ff;font-size:14px">Reference ${escapeHtml(referenceCode)}</p></div><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#fff">${rows}</table><div style="background:#111318;color:#cbd5e1;padding:18px 28px;font-size:12px;line-height:1.6">Submitted through u40academy.com and saved in the U40 admissions database.</div></div></body></html>`,
  };
}

export async function sendAdmissionInquiryNotification(
  email: SendEmail,
  input: AdmissionInquiryInput,
  referenceCode: string
) {
  const content = createAdmissionEmail(input, referenceCode);

  return email.send({
    to: NOTIFICATION_DESTINATION,
    from: { email: NOTIFICATION_SENDER, name: "U40 Academy Inn" },
    replyTo: input.email || PUBLIC_CONTACT_ADDRESS,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
}
