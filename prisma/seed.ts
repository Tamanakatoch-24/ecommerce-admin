import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, "seed-data.csv");
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const records: {
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    stock: string;
    category: string;
  }[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`Found ${records.length} products in CSV`);

  const categoryNames = [...new Set(records.map((r) => r.category))];

  const categoryMap: Record<string, string> = {};

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoryMap[name] = category.id;
    console.log(`Category ready: ${name}`);
  }

  for (const record of records) {
    await prisma.product.create({
      data: {
        name: record.name,
        description: record.description,
        price: parseFloat(record.price),
        imageUrl: record.imageUrl,
        stock: parseInt(record.stock),
        categoryId: categoryMap[record.category],
      },
    });
    console.log(`Created product: ${record.name}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });