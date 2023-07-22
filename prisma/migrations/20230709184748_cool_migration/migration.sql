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

-- CreateIndex
CREATE UNIQUE INDEX "VideoTrack_videoDataId_key" ON "VideoTrack"("videoDataId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoTrack_trackInfoId_key" ON "VideoTrack"("trackInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "AudioTrack_trackInfoId_key" ON "AudioTrack"("trackInfoId");

-- AddForeignKey
ALTER TABLE "VideoTrack" ADD CONSTRAINT "VideoTrack_videoDataId_fkey" FOREIGN KEY ("videoDataId") REFERENCES "VideoData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoTrack" ADD CONSTRAINT "VideoTrack_trackInfoId_fkey" FOREIGN KEY ("trackInfoId") REFERENCES "TrackInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioTrack" ADD CONSTRAINT "AudioTrack_videoDataId_fkey" FOREIGN KEY ("videoDataId") REFERENCES "VideoData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioTrack" ADD CONSTRAINT "AudioTrack_trackInfoId_fkey" FOREIGN KEY ("trackInfoId") REFERENCES "TrackInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
