import express from "express";
import Wallet from "../models/Wallet.js";
import { getCryptoPrice } from "../services/priceService.js"; // Assumes you have a cached price fetcher

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const wallets = await Wallet.find({ userId: req.params.userId });
    if (!wallets || wallets.length === 0) {
      return res.status(404).json({ message: "No wallet found for this user." });
    }

    const response = await Promise.all(
      wallets.map(async (wallet) => {
        const price = await getCryptoPrice(wallet.currency); // e.g., BTC or ETH
        const usdEquivalent = wallet.balance * price;
        return {
          currency: wallet.currency,
          balance: wallet.balance,
          usdEquivalent: usdEquivalent.toFixed(2),
        };
      })
    );

    res.json(response);
  } catch (error) {
    console.error("Wallet fetch error:", error);
    res.status(500).json({ message: "Server error while fetching wallet." });
  }
});

router.post("/add", async (req, res) => {
  const { userId, currency, amount } = req.body;

  let wallet = await Wallet.findOne({ userId, currency });
  if (!wallet) {
    wallet = new Wallet({ userId, currency, balance: amount });
  } else {
    wallet.balance += amount;
  }

  await wallet.save();
  res.json({ success: true, wallet });
});



export default router;
