ALTER TABLE `email_subscribers` ADD `digestFrequency` enum('daily','weekly','monthly','never') DEFAULT 'weekly' NOT NULL;--> statement-breakpoint
ALTER TABLE `email_subscribers` ADD `contentTypes` varchar(255) DEFAULT 'blog,news,updates' NOT NULL;--> statement-breakpoint
ALTER TABLE `email_subscribers` ADD `lastDigestSentAt` timestamp;