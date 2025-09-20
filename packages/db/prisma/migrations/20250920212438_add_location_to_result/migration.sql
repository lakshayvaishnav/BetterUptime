/*
  Warnings:

  - Added the required column `Location` to the `CheckResult` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `CheckResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('Up', 'Down');

-- CreateEnum
CREATE TYPE "public"."Location" AS ENUM ('USA', 'INDIA');

-- AlterTable
ALTER TABLE "public"."CheckResult" ADD COLUMN     "Location" "public"."Location" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."Status" NOT NULL;
