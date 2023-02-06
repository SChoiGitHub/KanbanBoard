/*
  Warnings:

  - A unique constraint covering the columns `[boardId,ordering]` on the table `Status` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ordering` to the `Status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Status` ADD COLUMN `ordering` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Status_boardId_ordering_key` ON `Status`(`boardId`, `ordering`);
