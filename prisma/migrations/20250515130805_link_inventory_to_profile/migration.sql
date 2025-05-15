/*
  Warnings:

  - You are about to drop the column `inventoryId` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_inventoryId_fkey";

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "profileId" TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "inventoryId";

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_profileId_key" ON "Inventory"("profileId");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
