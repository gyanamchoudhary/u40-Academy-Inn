CREATE TABLE `admission_inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference_code` text NOT NULL,
	`student_name` text NOT NULL,
	`guardian_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`date_of_birth` text,
	`current_class` text NOT NULL,
	`course_interested` text NOT NULL,
	`board` text NOT NULL,
	`school_name` text,
	`previous_percentage` text,
	`address` text NOT NULL,
	`message` text,
	`status` text DEFAULT 'submitted' NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admission_inquiries_reference_code_unique` ON `admission_inquiries` (`reference_code`);--> statement-breakpoint
CREATE INDEX `admission_reference_idx` ON `admission_inquiries` (`reference_code`);--> statement-breakpoint
CREATE INDEX `admission_phone_idx` ON `admission_inquiries` (`phone`);--> statement-breakpoint
CREATE INDEX `admission_created_at_idx` ON `admission_inquiries` (`created_at`);