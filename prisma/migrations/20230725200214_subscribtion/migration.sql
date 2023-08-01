-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Moderator', 'User');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'User';

-- CreateTable
CREATE TABLE "SubscribtionTier" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "durationDays" INTEGER NOT NULL,

    CONSTRAINT "SubscribtionTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscribtion" (
    "id" TEXT NOT NULL,
    "subscribtionTierId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscribtion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscribtion" ADD CONSTRAINT "Subscribtion_subscribtionTierId_fkey" FOREIGN KEY ("subscribtionTierId") REFERENCES "SubscribtionTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribtion" ADD CONSTRAINT "Subscribtion_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
