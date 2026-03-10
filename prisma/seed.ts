import { prisma } from "../src/lib/prisma.js";

const products = [
  {
    name: "Gaming Laptop Pro",
    description: "High-performance gaming laptop with RTX graphics",
    price: 15999000,
    stock: 15,
    imageUrl: "https://via.placeholder.com/300x300?text=Gaming+Laptop",
  },
  {
    name: "Wireless Headphones",
    description: "Noise-cancelling Bluetooth headphones",
    price: 899000,
    stock: 50,
    imageUrl: "https://via.placeholder.com/300x300?text=Headphones",
  },
  {
    name: "Smartphone X",
    description: "Latest flagship smartphone with 5G",
    price: 12500000,
    stock: 30,
    imageUrl: "https://via.placeholder.com/300x300?text=Smartphone",
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with Cherry MX switches",
    price: 1250000,
    stock: 40,
    imageUrl: "https://via.placeholder.com/300x300?text=Keyboard",
  },
  {
    name: "4K Monitor",
    description: "27-inch 4K UHD display",
    price: 4500000,
    stock: 20,
    imageUrl: "https://via.placeholder.com/300x300?text=Monitor",
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking",
    price: 350000,
    stock: 100,
    imageUrl: "https://via.placeholder.com/300x300?text=Mouse",
  },
  {
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI and card reader",
    price: 450000,
    stock: 75,
    imageUrl: "https://via.placeholder.com/300x300?text=USB+Hub",
  },
  {
    name: "Portable SSD 1TB",
    description: "Fast external SSD with USB 3.2",
    price: 1800000,
    stock: 35,
    imageUrl: "https://via.placeholder.com/300x300?text=SSD",
  },
  {
    name: "Webcam HD",
    description: "1080p webcam with built-in microphone",
    price: 650000,
    stock: 45,
    imageUrl: "https://via.placeholder.com/300x300?text=Webcam",
  },
  {
    name: "Smart Watch",
    description: "Fitness tracking smartwatch with heart rate monitor",
    price: 2500000,
    stock: 25,
    imageUrl: "https://via.placeholder.com/300x300?text=Smart+Watch",
  },
];

async function main() {
  console.log("Seeding products...");

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
