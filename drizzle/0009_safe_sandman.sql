CREATE TABLE `blog_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`authorName` varchar(100) NOT NULL,
	`authorEmail` varchar(320) NOT NULL,
	`content` text NOT NULL,
	`status` enum('pending','approved','rejected','spam') NOT NULL DEFAULT 'pending',
	`ipAddress` varchar(45),
	`userAgent` text,
	`parentId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `blog_comments` ADD CONSTRAINT `blog_comments_postId_blog_posts_id_fk` FOREIGN KEY (`postId`) REFERENCES `blog_posts`(`id`) ON DELETE cascade ON UPDATE no action;