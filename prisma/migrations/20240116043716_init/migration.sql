/*
  Warnings:

  - Added the required column `poolName` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "poolName" VARCHAR(255) NOT NULL;
