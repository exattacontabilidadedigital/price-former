-- AlterTable
ALTER TABLE "Calculation" ADD COLUMN "desiredProfitMargin" REAL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tax" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "rate" REAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'OTHERS',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Tax" ("createdAt", "id", "name", "rate", "updatedAt") SELECT "createdAt", "id", "name", "rate", "updatedAt" FROM "Tax";
DROP TABLE "Tax";
ALTER TABLE "new_Tax" RENAME TO "Tax";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
