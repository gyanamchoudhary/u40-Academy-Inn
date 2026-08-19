import { TRPCError } from "@trpc/server";
import { admissionInquirySchema } from "@contracts/admissions";
import { createRouter, publicQuery } from "./middleware";
import { createAdmissionInquiry } from "./queries/admissions";
import { sendAdmissionInquiryNotification } from "./services/admissionEmail";
import { enforceAdmissionSecurity } from "./security";

function logFailure(event: string, error: unknown) {
  console.error(
    JSON.stringify({
      event,
      errorType: error instanceof Error ? error.name : "unknown",
    })
  );
}

export const admissionRouter = createRouter({
  submit: publicQuery
    .input(admissionInquirySchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await enforceAdmissionSecurity(ctx, input.turnstileToken);
        const result = await createAdmissionInquiry(ctx.db, input);

        if (result.created) {
          ctx.executionCtx.waitUntil(
            sendAdmissionInquiryNotification(
              ctx.admissionsEmail,
              input,
              result.confirmation.referenceCode
            ).catch(error => logFailure("admission_email_failed", error))
          );
        }

        return result.confirmation;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        logFailure("admission_create_failed", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "We could not submit the inquiry right now. Please try again.",
        });
      }
    }),
});
