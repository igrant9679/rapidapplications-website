CREATE TABLE `blog_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `blog_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_post_categories` (
	`blogPostId` int NOT NULL,
	`categoryId` int NOT NULL,
	CONSTRAINT `blog_post_categories_blogPostId_categoryId_pk` PRIMARY KEY(`blogPostId`,`categoryId`)
);
--> statement-breakpoint
CREATE TABLE `blog_post_tags` (
	`blogPostId` int NOT NULL,
	`tagId` int NOT NULL,
	CONSTRAINT `blog_post_tags_blogPostId_tagId_pk` PRIMARY KEY(`blogPostId`,`tagId`)
);
--> statement-breakpoint
CREATE TABLE `blog_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`slug` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_tags_name_unique` UNIQUE(`name`),
	CONSTRAINT `blog_tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `cms_pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`metaDescription` varchar(160),
	`metaKeywords` varchar(255),
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`template` varchar(50) DEFAULT 'default',
	`authorId` int NOT NULL,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cms_pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `cms_pages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `blog_post_categories` ADD CONSTRAINT `blog_post_categories_blogPostId_blog_posts_id_fk` FOREIGN KEY (`blogPostId`) REFERENCES `blog_posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_categories` ADD CONSTRAINT `blog_post_categories_categoryId_blog_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `blog_categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_tags` ADD CONSTRAINT `blog_post_tags_blogPostId_blog_posts_id_fk` FOREIGN KEY (`blogPostId`) REFERENCES `blog_posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_tags` ADD CONSTRAINT `blog_post_tags_tagId_blog_tags_id_fk` FOREIGN KEY (`tagId`) REFERENCES `blog_tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cms_pages` ADD CONSTRAINT `cms_pages_authorId_users_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;