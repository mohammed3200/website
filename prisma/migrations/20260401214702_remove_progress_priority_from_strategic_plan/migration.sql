/*
  Warnings:

  - You are about to drop the column `priority` on the `StrategicPlan` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `StrategicPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `StrategicPlan` DROP COLUMN `priority`,
    DROP COLUMN `progress`;
