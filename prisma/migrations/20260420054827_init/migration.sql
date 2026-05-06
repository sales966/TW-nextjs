-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SALES', 'ADMIN');

-- CreateEnum
CREATE TYPE "BoxCategory" AS ENUM ('MAILER_BOX', 'SHIPPING_BOX', 'FOLDING_CARTON', 'RIGID_BOX', 'SLEEVE_BOX', 'DISPLAY_BOX');

-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('REQUEST_QUOTE', 'SAMPLE_REQUEST', 'GENERAL_INQUIRY');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'REVIEWING', 'QUOTED', 'FOLLOWING_UP', 'WON', 'LOST', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ContactChannel" AS ENUM ('EMAIL', 'WHATSAPP', 'LINE', 'WECHAT');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('LOGO', 'DIELINE', 'DESIGN', 'REFERENCE', 'OTHER');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'SALES',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "BoxCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "shortDesc" TEXT,
    "imageUrl" TEXT,
    "gallery" TEXT[],
    "isEcoFriendly" BOOLEAN NOT NULL DEFAULT false,
    "moqMin" INTEGER NOT NULL DEFAULT 100,
    "industries" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "availableMaterials" JSONB NOT NULL,
    "availablePrintings" JSONB NOT NULL,
    "availableFinishes" JSONB NOT NULL,
    "minLength" DOUBLE PRECISION,
    "maxLength" DOUBLE PRECISION,
    "minWidth" DOUBLE PRECISION,
    "maxWidth" DOUBLE PRECISION,
    "minHeight" DOUBLE PRECISION,
    "maxHeight" DOUBLE PRECISION,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "inquiryNumber" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "company" TEXT,
    "country" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "lineId" TEXT,
    "wechatId" TEXT,
    "preferredChannel" "ContactChannel" NOT NULL DEFAULT 'EMAIL',
    "inquiryType" "InquiryType" NOT NULL DEFAULT 'REQUEST_QUOTE',
    "productId" TEXT,
    "boxCategory" "BoxCategory",
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "material" TEXT,
    "printing" TEXT,
    "finishes" TEXT[],
    "quantity" INTEGER,
    "timeline" TEXT,
    "notes" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "assignedTo" TEXT,
    "quotedPrice" DOUBLE PRECISION,
    "quotedTotal" DOUBLE PRECISION,
    "internalNotes" TEXT,
    "followUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uploaded_files" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL DEFAULT 'OTHER',
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "inquiryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_rules" (
    "id" TEXT NOT NULL,
    "boxCategory" "BoxCategory" NOT NULL,
    "material" TEXT NOT NULL,
    "basePriceMin" DOUBLE PRECISION NOT NULL,
    "basePriceMax" DOUBLE PRECISION NOT NULL,
    "printingCost" JSONB NOT NULL,
    "finishCost" JSONB NOT NULL,
    "quantityBreaks" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "inquiries_inquiryNumber_key" ON "inquiries"("inquiryNumber");

-- CreateIndex
CREATE INDEX "inquiries_status_idx" ON "inquiries"("status");

-- CreateIndex
CREATE INDEX "inquiries_contactEmail_idx" ON "inquiries"("contactEmail");

-- CreateIndex
CREATE INDEX "inquiries_inquiryNumber_idx" ON "inquiries"("inquiryNumber");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_rules_boxCategory_material_key" ON "pricing_rules"("boxCategory", "material");

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
