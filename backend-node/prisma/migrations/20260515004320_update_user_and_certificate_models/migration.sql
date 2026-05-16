/*
  Warnings:

  - The values [REJECTED] on the enum `CertificateStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CertificateStatus_new" AS ENUM ('PENDING', 'APPROVED', 'SUSPICIOUS', 'HIGH_RISK');
ALTER TABLE "Certificate" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Certificate" ALTER COLUMN "status" TYPE "CertificateStatus_new" USING ("status"::text::"CertificateStatus_new");
ALTER TYPE "CertificateStatus" RENAME TO "CertificateStatus_old";
ALTER TYPE "CertificateStatus_new" RENAME TO "CertificateStatus";
DROP TYPE "CertificateStatus_old";
ALTER TABLE "Certificate" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "aiSummary" TEXT,
ADD COLUMN     "trustScore" DOUBLE PRECISION;
