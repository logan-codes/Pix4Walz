import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 🧹 Clear existing data
  await prisma.userMessage.deleteMany({});
  await prisma.products.deleteMany({});
  await prisma.categories.deleteMany({});

  // 🌱 Seed Categories
  const categories = await prisma.categories.createMany({
    data: [
      {
        id: 1,
        name: "LIFESTYLE",
        image:
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop",
      },
      {
        id: 2,
        name: "ANIME & TOYS",
        image:
          "https://images.unsplash.com/photo-1606103836293-0a063a1c2b57?w=600&h=400&fit=crop",
      },
      {
        id: 3,
        name: "UNIQUE FINDS",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
      },
      {
        id: 4,
        name: "DECORS",
        image:
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop",
      },
    ],
  });
  console.log("✅ Categories seeded:", categories);

  // 🌱 Seed Products (merged + best-selling included)
  await prisma.products.createMany({
    data: [
      {
        id: 1,
        name: "20pcs Hotwheels single stand model 1 white",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
        originalPrice: 999,
        salePrice: 780,
        onSale: true,
        outOfStock: false,
        category_id: 1,
        bestSelling: false,
      },
      {
        id: 2,
        name: "20pcs Hotwheels single stand model 2 white",
        image:
          "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=400&fit=crop",
        originalPrice: 999,
        salePrice: 780,
        onSale: true,
        outOfStock: false,
        category_id: 1,
        bestSelling: false,
      },
      {
        id: 3,
        name: "5 Rack Honey comb Hotwheels Stand",
        image:
          "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=400&fit=crop",
        originalPrice: 349,
        salePrice: 299,
        onSale: true,
        outOfStock: false,
        category_id: 2,
        bestSelling: false,
      },
      {
        id: 4,
        name: "3 Rack Display Stand",
        image:
          "https://images.unsplash.com/photo-1597075095116-c0e3242f3f10?w=400&h=400&fit=crop",
        originalPrice: 599,
        salePrice: 449,
        onSale: true,
        outOfStock: false,
        category_id: 2,
        bestSelling: false,
      },
      {
        id: 5,
        name: "4 Rack Black Display Stand",
        image:
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=400&fit=crop",
        originalPrice: 699,
        salePrice: 549,
        onSale: true,
        outOfStock: false,
        category_id: 2,
        bestSelling: false,
      },
      {
        id: 6,
        name: "Character Display Collection",
        image:
          "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=400&fit=crop",
        originalPrice: 899,
        salePrice: 749,
        onSale: false,
        outOfStock: true,
        category_id: 3,
        bestSelling: false,
      },

      // 🏆 Merged Best-Selling Items
      {
        id: 7,
        name: "Premium Headphones",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        originalPrice: 2999,
        salePrice: 1999,
        onSale: true,
        outOfStock: false,
        category_id: 1,
        bestSelling: true,
      },
      {
        id: 8,
        name: "Wireless Mouse",
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
        originalPrice: 1499,
        salePrice: 999,
        onSale: true,
        outOfStock: true,
        category_id: 1,
        bestSelling: true,
      },
      {
        id: 9,
        name: "Smart Watch",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
        originalPrice: 4999,
        salePrice: 3499,
        onSale: false,
        outOfStock: false,
        category_id: 1,
        bestSelling: true,
      },
      {
        id: 10,
        name: "Laptop Stand",
        image:
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
        originalPrice: 1999,
        salePrice: 1299,
        onSale: true,
        outOfStock: false,
        category_id: 4,
        bestSelling: true,
      },
      {
        id: 11,
        name: "Keyboard",
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop",
        originalPrice: 3999,
        salePrice: 2999,
        onSale: false,
        outOfStock: false,
        category_id: 4,
        bestSelling: true,
      },
      {
        id: 12,
        name: "USB Cable",
        image:
          "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=300&fit=crop",
        originalPrice: 599,
        salePrice: 399,
        onSale: true,
        outOfStock: true,
        category_id: 4,
        bestSelling: true,
      },
    ],
  });
  console.log("✅ Products seeded (with bestSelling flag)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
