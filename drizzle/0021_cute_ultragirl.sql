CREATE TABLE `custom_post_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postTypeId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text,
	`featuredImage` varchar(500),
	`authorId` int NOT NULL,
	`parentId` int,
	`status` enum('draft','published','scheduled','archived') NOT NULL DEFAULT 'draft',
	`publishedAt` timestamp,
	`scheduledPublishAt` timestamp,
	`menuOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `custom_post_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `custom_post_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`singularName` varchar(100) NOT NULL,
	`pluralName` varchar(100) NOT NULL,
	`description` text,
	`icon` varchar(50),
	`isPublic` int NOT NULL DEFAULT 1,
	`hasArchive` int NOT NULL DEFAULT 1,
	`hierarchical` int NOT NULL DEFAULT 0,
	`supportsTitle` int NOT NULL DEFAULT 1,
	`supportsContent` int NOT NULL DEFAULT 1,
	`supportsExcerpt` int NOT NULL DEFAULT 1,
	`supportsFeaturedImage` int NOT NULL DEFAULT 1,
	`supportsCategories` int NOT NULL DEFAULT 0,
	`supportsTags` int NOT NULL DEFAULT 0,
	`supportsComments` int NOT NULL DEFAULT 0,
	`menuPosition` int DEFAULT 20,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `custom_post_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `custom_post_types_name_unique` UNIQUE(`name`),
	CONSTRAINT `custom_post_types_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `custom_post_items` ADD CONSTRAINT `custom_post_items_postTypeId_custom_post_types_id_fk` FOREIGN KEY (`postTypeId`) REFERENCES `custom_post_types`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `custom_post_items` ADD CONSTRAINT `custom_post_items_authorId_users_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;