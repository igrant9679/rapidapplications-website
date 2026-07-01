CREATE TABLE `menu_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`menuId` int NOT NULL,
	`parentId` int,
	`label` varchar(100) NOT NULL,
	`type` enum('custom','page','post','category','tag','post-type') NOT NULL,
	`url` varchar(500),
	`targetId` int,
	`targetType` varchar(50),
	`cssClasses` varchar(255),
	`target` varchar(20) DEFAULT '_self',
	`menuOrder` int DEFAULT 0,
	`isVisible` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menu_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`location` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menus_id` PRIMARY KEY(`id`),
	CONSTRAINT `menus_name_unique` UNIQUE(`name`),
	CONSTRAINT `menus_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `menu_items` ADD CONSTRAINT `menu_items_menuId_menus_id_fk` FOREIGN KEY (`menuId`) REFERENCES `menus`(`id`) ON DELETE cascade ON UPDATE no action;