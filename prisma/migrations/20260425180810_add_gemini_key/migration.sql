-- AlterTable
ALTER TABLE "StudySession" ADD COLUMN     "topicId" TEXT;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "metadata" JSONB;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
