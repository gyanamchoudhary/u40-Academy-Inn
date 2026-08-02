import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const admissionInquiries = sqliteTable(
  "admission_inquiries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    referenceCode: text("reference_code").notNull().unique(),
    studentName: text("student_name").notNull(),
    guardianName: text("guardian_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    dateOfBirth: text("date_of_birth"),
    currentClass: text("current_class").notNull(),
    courseInterested: text("course_interested").notNull(),
    board: text("board").notNull(),
    schoolName: text("school_name"),
    previousPercentage: text("previous_percentage"),
    address: text("address").notNull(),
    message: text("message"),
    status: text("status", {
      enum: ["submitted", "contacted", "under_review", "admitted", "closed"],
    })
      .notNull()
      .default("submitted"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("admission_reference_idx").on(table.referenceCode),
    index("admission_phone_idx").on(table.phone),
    index("admission_created_at_idx").on(table.createdAt),
  ],
);

export type AdmissionInquiry = typeof admissionInquiries.$inferSelect;
export type InsertAdmissionInquiry = typeof admissionInquiries.$inferInsert;
