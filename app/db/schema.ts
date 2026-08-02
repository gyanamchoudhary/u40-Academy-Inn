import {
  index,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const applicationStatus = mysqlEnum("status", [
  "submitted",
  "contacted",
  "under_review",
  "admitted",
  "closed",
]);

export const admissionInquiries = mysqlTable(
  "admission_inquiries",
  {
    id: serial("id").primaryKey(),
    referenceCode: varchar("reference_code", { length: 24 }).notNull().unique(),
    studentName: varchar("student_name", { length: 120 }).notNull(),
    guardianName: varchar("guardian_name", { length: 120 }).notNull(),
    phone: varchar("phone", { length: 24 }).notNull(),
    email: varchar("email", { length: 320 }),
    dateOfBirth: varchar("date_of_birth", { length: 10 }),
    currentClass: varchar("current_class", { length: 40 }).notNull(),
    courseInterested: varchar("course_interested", { length: 120 }).notNull(),
    board: varchar("board", { length: 40 }).notNull(),
    schoolName: varchar("school_name", { length: 160 }),
    previousPercentage: varchar("previous_percentage", { length: 20 }),
    address: text("address").notNull(),
    message: text("message"),
    status: applicationStatus.notNull().default("submitted"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    referenceCodeIdx: index("admission_reference_idx").on(table.referenceCode),
    phoneIdx: index("admission_phone_idx").on(table.phone),
    createdAtIdx: index("admission_created_at_idx").on(table.createdAt),
  }),
);

export type AdmissionInquiry = typeof admissionInquiries.$inferSelect;
export type InsertAdmissionInquiry = typeof admissionInquiries.$inferInsert;
