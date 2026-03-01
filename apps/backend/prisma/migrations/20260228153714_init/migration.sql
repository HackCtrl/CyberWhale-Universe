/*
  Warnings:

  - You are about to drop the column `resetExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetExpiry",
DROP COLUMN "resetToken";

-- CreateTable
CREATE TABLE "CTFSolve" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ctfId" INTEGER NOT NULL,
    "solvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CTFSolve_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CTFSolve" ADD CONSTRAINT "CTFSolve_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CTFSolve" ADD CONSTRAINT "CTFSolve_ctfId_fkey" FOREIGN KEY ("ctfId") REFERENCES "CTFChallenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
