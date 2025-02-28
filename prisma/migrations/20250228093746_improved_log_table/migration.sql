-- AlterEnum
ALTER TYPE "LogEvent" ADD VALUE 'RECOMMEND';

-- AlterTable
ALTER TABLE "log" ALTER COLUMN "event_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "subject" DROP NOT NULL,
ALTER COLUMN "data" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "user_provider" DROP NOT NULL;
