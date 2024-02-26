-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "contract" VARCHAR(255) NOT NULL,
    "poolIndex" INTEGER NOT NULL,
    "SBKey" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "projectIcon" VARCHAR(255) NOT NULL,
    "isSuccess" BOOLEAN NOT NULL DEFAULT false,
    "poolInfo" JSON NOT NULL,
    "netId" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
