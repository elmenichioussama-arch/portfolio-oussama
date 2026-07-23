CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`organization` text DEFAULT '' NOT NULL,
	`subject` text DEFAULT '' NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT "contact_messages_status_check" CHECK("contact_messages"."status" in ('new', 'read', 'archived'))
);
--> statement-breakpoint
CREATE INDEX `contact_messages_created_at_idx` ON `contact_messages` (`created_at`);--> statement-breakpoint
CREATE INDEX `contact_messages_status_created_at_idx` ON `contact_messages` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `contact_rate_limits` (
	`bucket` text PRIMARY KEY NOT NULL,
	`request_count` integer DEFAULT 0 NOT NULL,
	`window_start` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contact_rate_limits_expires_at_idx` ON `contact_rate_limits` (`expires_at`);