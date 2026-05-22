-- CreateTable
CREATE TABLE "project_settings" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "customDomain" TEXT,
    "faviconUrl" TEXT,
    "analyticsId" TEXT,
    "publishStatus" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "websiteJson" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_settings_projectId_key" ON "project_settings"("projectId");

-- CreateIndex
CREATE INDEX "templates_category_idx" ON "templates"("category");

-- CreateIndex
CREATE INDEX "templates_userId_idx" ON "templates"("userId");

-- AddForeignKey
ALTER TABLE "project_settings" ADD CONSTRAINT "project_settings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
