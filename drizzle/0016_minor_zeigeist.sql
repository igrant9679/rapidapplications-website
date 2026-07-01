CREATE TABLE `page_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageId` int NOT NULL,
	`pageType` enum('blog','cms') NOT NULL,
	`visitorId` varchar(255) NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`referrer` text,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `page_views_id` PRIMARY KEY(`id`)
);
