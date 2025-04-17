/*
  Warnings:

  - You are about to alter the column `pinCode` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(6)`.

*/
-- AlterTable
ALTER TABLE `addresses` MODIFY `pinCode` VARCHAR(6) NOT NULL;
