ALTER TABLE `users` ADD `notifyComments` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `notifyApprovals` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `notifyMentions` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `notifySystem` int DEFAULT 1 NOT NULL;