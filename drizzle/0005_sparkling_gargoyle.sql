CREATE TABLE `collection_images` (
	`collectionId` int NOT NULL,
	`mediaId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collection_images_collectionId_mediaId_pk` PRIMARY KEY(`collectionId`,`mediaId`)
);
--> statement-breakpoint
CREATE TABLE `media_collections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `media_collections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `collection_images` ADD CONSTRAINT `collection_images_collectionId_media_collections_id_fk` FOREIGN KEY (`collectionId`) REFERENCES `media_collections`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collection_images` ADD CONSTRAINT `collection_images_mediaId_media_id_fk` FOREIGN KEY (`mediaId`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `media_collections` ADD CONSTRAINT `media_collections_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;