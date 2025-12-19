/*
  Warnings:

  - You are about to drop the column `msg` on the `Part` table. All the data in the column will be lost.
  - Added the required column `text` to the `Part` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Part" DROP COLUMN "msg",
ADD COLUMN     "text" TEXT NOT NULL;
