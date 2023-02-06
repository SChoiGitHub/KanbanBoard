/*
  Warnings:

  - A unique constraint covering the columns `[boardId,title]` on the table `Status` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Status_boardId_title_key` ON `Status`(`boardId`, `title`);
