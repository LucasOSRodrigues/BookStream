-- CreateEnum
CREATE TYPE "status" AS ENUM ('draft', 'published');

-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "avatar_url" TEXT,
    "bio" TEXT,
    "followers_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "genre" (
    "genre_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("genre_id")
);

-- CreateTable
CREATE TABLE "work" (
    "work_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "genre_id" TEXT NOT NULL,
    "description" TEXT,
    "cover_image_url" TEXT,
    "published_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_pkey" PRIMARY KEY ("work_id")
);

-- CreateTable
CREATE TABLE "chapter" (
    "chapter_id" TEXT NOT NULL,
    "work_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapter_pkey" PRIMARY KEY ("chapter_id")
);

-- CreateTable
CREATE TABLE "follow" (
    "follower_id" TEXT NOT NULL,
    "followed_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("follower_id","followed_id")
);

-- CreateTable
CREATE TABLE "like" (
    "user_id" TEXT NOT NULL,
    "chapter_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "like_pkey" PRIMARY KEY ("user_id","chapter_id")
);

-- CreateTable
CREATE TABLE "comment" (
    "comment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "chapter_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "read_progress" (
    "user_id" TEXT NOT NULL,
    "work_id" TEXT NOT NULL,
    "current_chapter_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "read_progress_pkey" PRIMARY KEY ("user_id","work_id")
);

-- CreateTable
CREATE TABLE "_genreTowork" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_genreTowork_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "genre_name_key" ON "genre"("name");

-- CreateIndex
CREATE INDEX "follow_followed_id_idx" ON "follow"("followed_id");

-- CreateIndex
CREATE INDEX "like_chapter_id_idx" ON "like"("chapter_id");

-- CreateIndex
CREATE INDEX "read_progress_work_id_idx" ON "read_progress"("work_id");

-- CreateIndex
CREATE INDEX "_genreTowork_B_index" ON "_genreTowork"("B");

-- AddForeignKey
ALTER TABLE "work" ADD CONSTRAINT "work_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter" ADD CONSTRAINT "chapter_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "work"("work_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapter"("chapter_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapter"("chapter_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "read_progress" ADD CONSTRAINT "read_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "read_progress" ADD CONSTRAINT "read_progress_current_chapter_id_fkey" FOREIGN KEY ("current_chapter_id") REFERENCES "chapter"("chapter_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_genreTowork" ADD CONSTRAINT "_genreTowork_A_fkey" FOREIGN KEY ("A") REFERENCES "genre"("genre_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_genreTowork" ADD CONSTRAINT "_genreTowork_B_fkey" FOREIGN KEY ("B") REFERENCES "work"("work_id") ON DELETE CASCADE ON UPDATE CASCADE;
