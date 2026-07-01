CREATE TABLE `media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`url` varchar(1000) NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`fileSize` int NOT NULL,
	`width` int,
	`height` int,
	`uploadedBy` int NOT NULL,
	`altText` varchar(255),
	`caption` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `media_id` PRIMARY KEY(`id`),
	CONSTRAINT `media_fileKey_unique` UNIQUE(`fileKey`)
);
--> statement-breakpoint
ALTER TABLE `media` ADD CONSTRAINT `media_uploadedBy_users_id_fk` FOREIGN KEY (`uploadedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;