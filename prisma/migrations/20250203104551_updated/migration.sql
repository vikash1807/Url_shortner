/*
  Warnings:

  - You are about to drop the column `original_url` on the `Url` table. All the data in the column will be lost.
  - You are about to drop the column `short_url` on the `Url` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[originalUrl]` on the table `Url` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode]` on the table `Url` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `originalUrl` to the `Url` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortCode` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Url" DROP COLUMN "original_url",
DROP COLUMN "short_url",
ADD COLUMN     "originalUrl" TEXT NOT NULL,
ADD COLUMN     "shortCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Url_originalUrl_key" ON "Url"("originalUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Url_shortCode_key" ON "Url"("shortCode");
