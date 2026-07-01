CREATE TABLE `import_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceUrl` varchar(500) NOT NULL,
	`importedBy` int NOT NULL,
	`status` enum('in_progress','completed','failed') NOT NULL DEFAULT 'in_progress',
	`totalPosts` int DEFAULT 0,
	`importedPosts` int DEFAULT 0,
	`skippedPosts` int DEFAULT 0,
	`failedPosts` int DEFAULT 0,
	`errorMessage` text,
	`transformationRules` json,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `import_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `import_history` ADD CONSTRAINT `import_history_importedBy_users_id_fk` FOREIGN KEY (`importedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;