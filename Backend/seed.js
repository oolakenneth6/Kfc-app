const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Menu = require("./model/menuSchema");

const dataPath = path.join(__dirname, "data", "SliderData.json");

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.DATABASE);

    console.log("Connected to MongoDB");

    const rawData = fs.readFileSync(dataPath, "utf8");
    const sliderData = JSON.parse(rawData);

    const products = [
      ...(sliderData.featured || []),
      ...(sliderData.favorites || []),
      ...(sliderData.quickbites || [])
    ];

    console.log(`Found ${products.length} products`);

    await Menu.deleteMany({});

    console.log("Old menu data cleared");

    const insertedProducts = await Menu.insertMany(products);

    console.log(`${insertedProducts.length} products inserted successfully`);

    await mongoose.connection.close();

    console.log("Database connection closed");
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:");
    console.error(error);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

seedDatabase();