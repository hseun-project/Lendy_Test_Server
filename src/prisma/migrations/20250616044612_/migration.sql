-- CreateTable
CREATE TABLE "Bank" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "bankName" VARCHAR(20) NOT NULL,
    "bankNumber" VARCHAR(20) NOT NULL,
    "bankNumberMasked" VARCHAR(20) NOT NULL,
    "apiTranId" VARCHAR(40) NOT NULL,
    "alias" VARCHAR(50) NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bank_userId_key" ON "Bank"("userId");
