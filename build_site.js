const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\Users\\tomor\\Documents\\003';
const srcDir = path.join(projectRoot, 'src');

const files = {
  'prisma/schema.prisma': `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  ADMIN
  MANAGER
}

enum LeadStatus {
  NEW
  CONTACTED
  QUOTED
  CONVERTED
  CLOSED
}

enum QuoteStatus {
  PENDING
  QUOTED
  REJECTED
}

enum BoxType {
  MAILER_BOX
  SHIPPING_BOX
  FOLDING_CARTON
  RIGID_BOX
}

enum FileRelationType {
  QUOTE_ATTACHMENT
  PRODUCT_IMAGE
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  role         UserRole @default(MANAGER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Lead {
  id           String   @id @default(uuid())
  contactName  String
  email        String   @unique
  companyName  String?
  country      String
  phone        String?
  whatsapp     String?
  status       LeadStatus @default(NEW)
  
  quoteRequests QuoteRequest[]
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([status])
}

model Product {
  id           String   @id @default(uuid())
  name         String
  slug         String   @unique
  summary      String
  description  String?
  boxType      BoxType
  featuredImage String?
  moq          Int      @default(500)
  isActive     Boolean  @default(true)
  
  quoteRequests QuoteRequest[]
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  deletedAt    DateTime? 

  @@index([deletedAt, isActive])
  @@index([boxType])
}

model QuoteRequest {
  id           String   @id @default(cuid())
  leadId       String
  productId    String?
  
  boxType      BoxType
  length       Float
  width        Float
  height       Float
  unit         String   @default("mm")
  material     String
  printing     String
  finishes     Json?    
  quantity     Int
  notes        String?
  
  status       QuoteStatus @default(PENDING)
  
  lead         Lead      @relation(fields: [leadId], references: [id])
  product      Product?  @relation(fields: [productId], references: [id], onDelete: SetNull)
  files        UploadedFile[]
  
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@index([leadId])
  @@index([status])
}

model UploadedFile {
  id           String   @id @default(uuid())
  fileName     String
  fileUrl      String
  fileSize     Int
  fileType     String
  
  relatedType  FileRelationType
  relatedId    String
  
  quote        QuoteRequest? @relation(fields: [relatedId], references: [id], map: "quote_file_fk")
  
  createdAt    DateTime @default(now())
}`,

  'src/lib/mock/products.ts': `export const mockProducts = [
  {
    id: "p_1001",
    name: "Classic Mailer Box",
    slug: "classic-mailer-box",
    boxType: "MAILER_BOX",
    summary: "The ultimate unboxing experience. Self-locking, durable, and perfect for e-commerce shipments.",
    description: "Our Classic Mailer Boxes are structurally engineered for safe transit without the need for extra packaging materials. Ships flat and assembles in seconds.",
    moq: 100,
  },
  {
    id: "p_1002",
    name: "Standard Shipping Carton",
    slug: "standard-shipping-carton",
    boxType: "SHIPPING_BOX",
    summary: "Heavy-duty corrugated boxes designed to protect large or heavy items through postal networks.",
    description: "Built with thick dual-wall corrugated board, making it the toughest box in our lineup.",
    moq: 500,
  },
  {
    id: "p_1003",
    name: "Straight Tuck Carton",
    slug: "straight-tuck-carton",
    boxType: "FOLDING_CARTON",
    summary: "Lightweight folding cartons ideal for retail packaging, cosmetics, and lightweight electronics.",
    description: "Printed on premium CCNB paperboard, ensuring extremely vibrant colors and sharp details.",
    moq: 1000,
  },
  {
    id: "p_1004",
    name: "Premium Rigid Setup Box",
    slug: "premium-rigid-setup-box",
    boxType: "RIGID_BOX",
    summary: "Luxury packaging with a robust feel. Does not fold flat.",
    description: "A two-piece setup box offering a high-end unboxing presentation. Perfect for jewelry, tech gadgets, or luxury gifts.",
    moq: 500,
  }
];`,

  'src/lib/mock/admin.ts': `export const mockLeads = [
  { id: "l_1", contactName: "Alice Smith", email: "alice@example.com", companyName: "TechCorp", country: "US", status: "NEW" },
  { id: "l_2", contactName: "Bob Johnson", email: "bob@example.com", companyName: null, country: "UK", status: "CONTACTED" },
];

export const mockQuotes = [
  { id: "q_1", leadId: "l_1", contactName: "Alice Smith", companyName: "TechCorp", email: "alice@example.com", boxType: "MAILER_BOX", quantity: 1500, status: "PENDING", length: 200, width: 150, height: 50, unit: "mm", material: "KRAFT", printing: "CMYK_OUT", country: "US" },
  { id: "q_2", leadId: "l_2", contactName: "Bob Johnson", companyName: "Personal", email: "bob@example.com", boxType: "RIGID_BOX", quantity: 500, status: "PROCESSING", length: 100, width: 100, height: 100, unit: "mm", material: "CCNB", printing: "NONE", country: "UK" }
];

export const mockProducts = [
  { id: "p_1", name: "Classic Mailer Box", slug: "classic-mailer-box", boxType: "MAILER_BOX", summary: "Durable e-commerce box", moq: 100, isActive: true },
  { id: "p_2", name: "Premium Rigid Box", slug: "premium-rigid-box", boxType: "RIGID_BOX", summary: "Luxury packaging", moq: 500, isActive: true },
];`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(projectRoot, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created:', relativePath);
}
