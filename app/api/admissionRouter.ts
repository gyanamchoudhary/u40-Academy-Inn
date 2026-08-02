import { TRPCError } from "@trpc/server";
import {
  admissionInquirySchema,
  trackApplicationSchema,
} from "@contracts/admissions";
import { createRouter, publicQuery } from "./middleware";
import {
  createAdmissionInquiry,
  findAdmissionInquiryForTracking,
} from "./queries/admissions";

export const admissionRouter = createRouter({
  submit: publicQuery
    .input(admissionInquirySchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await createAdmissionInquiry(ctx.db, input);
      } catch (error) {
        console.error("Failed to create admission inquiry", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "We could not submit the inquiry right now. Please try again.",
        });
      }
    }),

  track: publicQuery
    .input(trackApplicationSchema)
    .query(async ({ input, ctx }) => {
      const inquiry = await findAdmissionInquiryForTracking(
        ctx.db,
        input.referenceCode,
        input.phone,
      );

      if (!inquiry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "No application matched that reference code and phone number.",
        });
      }

      return inquiry;
    }),
});
