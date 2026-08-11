import { TRPCError } from "@trpc/server";
import { admissionInquirySchema } from "@contracts/admissions";
import { createRouter, publicQuery } from "./middleware";
import { createAdmissionInquiry } from "./queries/admissions";

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
});
