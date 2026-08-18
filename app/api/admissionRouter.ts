import { TRPCError } from "@trpc/server";
import { admissionInquirySchema } from "@contracts/admissions";
import { createRouter, publicQuery } from "./middleware";
import { createAdmissionInquiry } from "./queries/admissions";
import { sendAdmissionInquiryNotification } from "./services/admissionEmail";

export const admissionRouter = createRouter({
  submit: publicQuery
    .input(admissionInquirySchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const inquiry = await createAdmissionInquiry(ctx.db, input);

        try {
          await sendAdmissionInquiryNotification(
            ctx.admissionsEmail,
            input,
            inquiry.referenceCode
          );
        } catch (error) {
          // The inquiry is already safely stored in D1. Do not make the family
          // submit it twice if the notification provider has a transient issue.
          console.error(
            "Failed to email admission inquiry notification",
            error
          );
        }

        return inquiry;
      } catch (error) {
        console.error("Failed to create admission inquiry", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "We could not submit the inquiry right now. Please try again.",
        });
      }
    }),
});
