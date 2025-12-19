/*
  Warnings:

  - You are about to drop the column `msg` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "msg";

-- CreateTable
CREATE TABLE "Part" (
    "id" TEXT NOT NULL,
    "msg" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
