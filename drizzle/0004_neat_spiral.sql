CREATE TABLE `media_image_tags` (
	`mediaId` int NOT NULL,
	`tagId` int NOT NULL,
	CONSTRAINT `media_image_tags_mediaId_tagId_pk` PRIMARY KEY(`mediaId`,`tagId`)
);
--> statement-breakpoint
CREATE TABLE `media_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`slug` varchar(50) NOT NULL,
	`color` varchar(7),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `media_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `media_tags_name_unique` UNIQUE(`name`),
	CONSTRAINT `media_tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `media_image_tags` ADD CONSTRAINT `media_image_tags_mediaId_media_id_fk` FOREIGN KEY (`mediaId`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `media_image_tags` ADD CONSTRAINT `media_image_tags_tagId_media_tags_id_fk` FOREIGN KEY (`tagId`) REFERENCES `media_tags`(`id`) ON DELETE cascade ON UPDATE no action;