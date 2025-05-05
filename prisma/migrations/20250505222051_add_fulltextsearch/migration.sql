-- CreateIndex
CREATE FULLTEXT INDEX `product_name_description_tags_idx` ON `product`(`name`, `description`, `tags`);
