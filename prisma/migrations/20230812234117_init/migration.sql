-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Moderator', 'User');

-- CreateEnum
CREATE TYPE "UploadStage" AS ENUM ('Uploading', 'Processing', 'Deploying', 'Complite');

-- CreateEnum
CREATE TYPE "StageStatus" AS ENUM ('InProgress', 'Complite', 'Failed');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'User',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

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

-- CreateTable
CREATE TABLE "VideoData" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "previewURL" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "views" INTEGER NOT NULL,
    "tags" TEXT[],
    "uploadedDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "VideoData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackInfo" (
    "id" TEXT NOT NULL,
    "segmentsCount" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "codec" TEXT NOT NULL,
    "trackPath" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TrackInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoTrack" (
    "id" TEXT NOT NULL,
    "videoDataId" TEXT NOT NULL,
    "trackInfoId" TEXT NOT NULL,

    CONSTRAINT "VideoTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioTrack" (
    "id" TEXT NOT NULL,
    "videoDataId" TEXT NOT NULL,
    "trackInfoId" TEXT NOT NULL,

    CONSTRAINT "AudioTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadState" (
    "id" TEXT NOT NULL,
    "videoDataId" TEXT NOT NULL,
    "stage" "UploadStage" NOT NULL,
    "stageStage" "StageStatus" NOT NULL,
    "filePath" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UploadState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TierToVideo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "VideoTrack_videoDataId_key" ON "VideoTrack"("videoDataId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoTrack_trackInfoId_key" ON "VideoTrack"("trackInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "AudioTrack_trackInfoId_key" ON "AudioTrack"("trackInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "UploadState_videoDataId_key" ON "UploadState"("videoDataId");

-- CreateIndex
CREATE UNIQUE INDEX "_TierToVideo_AB_unique" ON "_TierToVideo"("A", "B");

-- CreateIndex
CREATE INDEX "_TierToVideo_B_index" ON "_TierToVideo"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribtion" ADD CONSTRAINT "Subscribtion_subscribtionTierId_fkey" FOREIGN KEY ("subscribtionTierId") REFERENCES "SubscribtionTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribtion" ADD CONSTRAINT "Subscribtion_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoTrack" ADD CONSTRAINT "VideoTrack_videoDataId_fkey" FOREIGN KEY ("videoDataId") REFERENCES "VideoData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoTrack" ADD CONSTRAINT "VideoTrack_trackInfoId_fkey" FOREIGN KEY ("trackInfoId") REFERENCES "TrackInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioTrack" ADD CONSTRAINT "AudioTrack_videoDataId_fkey" FOREIGN KEY ("videoDataId") REFERENCES "VideoData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioTrack" ADD CONSTRAINT "AudioTrack_trackInfoId_fkey" FOREIGN KEY ("trackInfoId") REFERENCES "TrackInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadState" ADD CONSTRAINT "UploadState_videoDataId_fkey" FOREIGN KEY ("videoDataId") REFERENCES "VideoData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TierToVideo" ADD CONSTRAINT "_TierToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "SubscribtionTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TierToVideo" ADD CONSTRAINT "_TierToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "VideoData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
