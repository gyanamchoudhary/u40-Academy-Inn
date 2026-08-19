ALTER TABLE `admission_inquiries` ADD `idempotency_key` text;--> statement-breakpoint
ALTER TABLE `admission_inquiries` ADD `consent_at` integer;--> statement-breakpoint
ALTER TABLE `admission_inquiries` ADD `privacy_notice_version` text;--> statement-breakpoint
CREATE UNIQUE INDEX `admission_inquiries_idempotency_key_unique` ON `admission_inquiries` (`idempotency_key`);