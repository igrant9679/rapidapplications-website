CREATE TABLE `email_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(100),
	`status` enum('active','unsubscribed') NOT NULL DEFAULT 'active',
	`subscribeSource` varchar(100),
	`confirmationToken` varchar(64),
	`confirmedAt` timestamp,
	`unsubscribedAt` timestamp,
	`subscribedAt` timestamp NOT NULL DEFAULT (now()),
	`lastEmailSentAt` timestamp,
	CONSTRAINT `email_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_subscribers_email_unique` UNIQUE(`email`)
);
