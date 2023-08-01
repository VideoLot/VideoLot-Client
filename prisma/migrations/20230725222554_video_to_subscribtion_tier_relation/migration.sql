-- CreateTable
CREATE TABLE "_TierToVideo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TierToVideo_AB_unique" ON "_TierToVideo"("A", "B");

-- CreateIndex
CREATE INDEX "_TierToVideo_B_index" ON "_TierToVideo"("B");

-- AddForeignKey
ALTER TABLE "_TierToVideo" ADD CONSTRAINT "_TierToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "SubscribtionTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TierToVideo" ADD CONSTRAINT "_TierToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "VideoData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
