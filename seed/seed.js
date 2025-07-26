
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await User.deleteMany({});
await Wallet.deleteMany({});

const users = await User.insertMany([
  { username: "alice" },
  { username: "bob" },
  { username: "charlie" },
]);

const wallets = [];

for (let user of users) {
  wallets.push(
    { userId: user._id, currency: "BTC", balance: 0.005 },
    { userId: user._id, currency: "ETH", balance: 0.1 }
  );
}

await Wallet.insertMany(wallets);
console.log("Seeded users and wallets");

process.exit();
