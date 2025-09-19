/*
  Warnings:

  - You are about to drop the column `chcekedAt` on the `CheckResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."CheckResult" DROP COLUMN "chcekedAt",
ADD COLUMN     "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
