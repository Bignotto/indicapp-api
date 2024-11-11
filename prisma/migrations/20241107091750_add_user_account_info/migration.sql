-- CreateEnum
CREATE TYPE "AccountProvider" AS ENUM ('GOOGLE', 'APPLE', 'EMAIL');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accountId" TEXT,
ADD COLUMN     "accountProvider" "AccountProvider" NOT NULL DEFAULT 'EMAIL';
