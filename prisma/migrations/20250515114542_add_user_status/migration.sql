-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DRAFT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
