-- CreateTable
CREATE TABLE "Credentials" (
    "user_id" INTEGER NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "Credentials_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "Credentials" ADD CONSTRAINT "Credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
