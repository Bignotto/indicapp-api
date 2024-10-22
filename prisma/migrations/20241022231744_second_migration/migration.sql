/*
  Warnings:

  - You are about to drop the `ServiceSubType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "provider_services" DROP CONSTRAINT "provider_services_serviceSubTypeId_fkey";

-- DropTable
DROP TABLE "ServiceSubType";

-- CreateTable
CREATE TABLE "service_sub_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "service_sub_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "provider_services" ADD CONSTRAINT "provider_services_serviceSubTypeId_fkey" FOREIGN KEY ("serviceSubTypeId") REFERENCES "service_sub_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
