/*
  Warnings:

  - Added the required column `parent_type_id` to the `service_sub_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_sub_types" ADD COLUMN     "parent_type_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "service_sub_types" ADD CONSTRAINT "service_sub_types_parent_type_id_fkey" FOREIGN KEY ("parent_type_id") REFERENCES "service_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
