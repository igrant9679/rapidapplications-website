CREATE TABLE `page_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageId` int NOT NULL,
	`versionNumber` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`metaDescription` varchar(160),
	`metaKeywords` varchar(255),
	`status` enum('draft','published','scheduled','archived') NOT NULL,
	`template` varchar(50),
	`authorId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`createdBy` int NOT NULL,
	CONSTRAINT `page_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `page_versions` ADD CONSTRAINT `page_versions_pageId_cms_pages_id_fk` FOREIGN KEY (`pageId`) REFERENCES `cms_pages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `page_versions` ADD CONSTRAINT `page_versions_authorId_users_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `page_versions` ADD CONSTRAINT `page_versions_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;