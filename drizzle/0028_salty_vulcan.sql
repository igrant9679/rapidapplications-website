CREATE TABLE `blog_series` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`coverImage` varchar(1000),
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_series_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_series_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_series_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seriesId` int NOT NULL,
	`postId` int NOT NULL,
	`orderIndex` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_series_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `blog_series_posts` ADD CONSTRAINT `blog_series_posts_seriesId_blog_series_id_fk` FOREIGN KEY (`seriesId`) REFERENCES `blog_series`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_series_posts` ADD CONSTRAINT `blog_series_posts_postId_blog_posts_id_fk` FOREIGN KEY (`postId`) REFERENCES `blog_posts`(`id`) ON DELETE cascade ON UPDATE no action;