ALTER TABLE `cms_pages` ADD `visibility` enum('public','private','password') DEFAULT 'public';--> statement-breakpoint
ALTER TABLE `cms_pages` ADD `password` varchar(255);--> statement-breakpoint
ALTER TABLE `cms_pages` ADD `requiredRole` enum('user','admin');