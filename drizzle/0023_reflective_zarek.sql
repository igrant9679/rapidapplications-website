CREATE TABLE `custom_field_values` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fieldId` int NOT NULL,
	`contentId` int NOT NULL,
	`contentType` varchar(50) NOT NULL,
	`value` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `custom_field_values_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `custom_fields` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`type` enum('text','textarea','number','select','checkbox','date','file','url','email') NOT NULL,
	`description` text,
	`defaultValue` text,
	`options` text,
	`isRequired` int NOT NULL DEFAULT 0,
	`contentType` varchar(50) NOT NULL,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `custom_fields_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `custom_field_values` ADD CONSTRAINT `custom_field_values_fieldId_custom_fields_id_fk` FOREIGN KEY (`fieldId`) REFERENCES `custom_fields`(`id`) ON DELETE cascade ON UPDATE no action;