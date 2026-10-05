CREATE TABLE `limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `limits_expiry` ON `limits` (`expires_at`);--> statement-breakpoint
CREATE TABLE `presence` (
	`key` text PRIMARY KEY NOT NULL,
	`room` text NOT NULL,
	`player` text NOT NULL,
	`seen_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `presence_room` ON `presence` (`room`);--> statement-breakpoint
CREATE TABLE `rooms` (
	`code` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`request_key` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`data` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_request_key_unique` ON `rooms` (`request_key`);--> statement-breakpoint
CREATE INDEX `rooms_owner_created` ON `rooms` (`owner`,`created_at`);--> statement-breakpoint
CREATE INDEX `rooms_expiry` ON `rooms` (`expires_at`);