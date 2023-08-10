/*
  Warnings:

  - You are about to alter the column `views` on the `VideoData` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "VideoData" ALTER COLUMN "views" SET DATA TYPE INTEGER;
