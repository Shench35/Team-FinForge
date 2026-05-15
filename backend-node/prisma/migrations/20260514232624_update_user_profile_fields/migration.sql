-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('PRO', 'PRO_MAX', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organisation" TEXT,
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'PRO';
