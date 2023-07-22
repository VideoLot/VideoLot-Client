-- CreateTable
CREATE TABLE "VideoData" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "previewURL" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "views" DECIMAL(65,30) NOT NULL,
    "tags" TEXT[],
    "uploadedDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "VideoData_pkey" PRIMARY KEY ("id")
);
