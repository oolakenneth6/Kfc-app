
const mongoose = require("mongoose");
const dns = require("node:dns").promises;

const db = process.env.MONGO_URI || process.env.DATABASE;

if (!db) {
  throw new Error("Set MONGO_URI or DATABASE in Backend/.env");
}

async function connectDatabase() {
  let uri = db;

  if (uri.startsWith("mongodb+srv://")) {
    const hosts = [
      "ac-xatx0nd-shard-00-00.wle8l8m.mongodb.net:27017",
      "ac-xatx0nd-shard-00-01.wle8l8m.mongodb.net:27017",
      "ac-xatx0nd-shard-00-02.wle8l8m.mongodb.net:27017",
    ];

    uri = uri
      .replace("mongodb+srv://", "mongodb://")
      .replace(
        "cluster0.wle8l8m.mongodb.net",
        hosts.join(",")
      );

    const separator = uri.includes("?") ? "&" : "?";

    uri += `${separator}authSource=admin&replicaSet=atlas-byaniy-shard-0&tls=true`;
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log("Connected to Database");
}

module.exports = connectDatabase();
