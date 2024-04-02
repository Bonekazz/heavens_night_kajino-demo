-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "pass" TEXT NOT NULL,
    "coins" INTEGER NOT NULL,
    "tickets" INTEGER NOT NULL,
    "fingers" INTEGER NOT NULL,
    "hasClaimedBonus" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("coins", "createdAt", "fingers", "id", "name", "pass", "tickets") SELECT "coins", "createdAt", "fingers", "id", "name", "pass", "tickets" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
