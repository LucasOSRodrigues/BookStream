/*
  Warnings:

  - The primary key for the `genre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `genre_id` on the `genre` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_genreTowork" DROP CONSTRAINT "_genreTowork_A_fkey";

-- AlterTable
ALTER TABLE "genre" DROP CONSTRAINT "genre_pkey",
DROP COLUMN "genre_id",
ADD CONSTRAINT "genre_pkey" PRIMARY KEY ("name");

-- AddForeignKey
ALTER TABLE "_genreTowork" ADD CONSTRAINT "_genreTowork_A_fkey" FOREIGN KEY ("A") REFERENCES "genre"("name") ON DELETE CASCADE ON UPDATE CASCADE;
