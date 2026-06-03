/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `works` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "works_title_key" ON "works"("title");
