import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import GameRound from "../models/GameRound.js";
import { getCryptoPrice } from "../services/priceService.js";
import crypto from "crypto";

export const placeBet = async (req, res) => {
  const { userId, usdAmount, currency } = req.body;
  const price = await getCryptoPrice(currency);
  const cryptoAmount = usdAmount / price;

  const wallet = await Wallet.findOne({ userId, currency });
  if (!wallet || wallet.balance < cryptoAmount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  wallet.balance -= cryptoAmount;
  await wallet.save();

  const txHash = crypto.randomBytes(8).toString("hex");

  await Transaction.create({
    userId,
    usdAmount,
    cryptoAmount,
    currency,
    transactionType: "bet",
    transactionHash: txHash,
    priceAtTime: price,
    timestamp: new Date(),
  });

  res.json({ success: true, cryptoAmount });
};

// export const cashOut = async (req, res) => {
//   const { userId, multiplier, currency } = req.body;
//   const price = await getCryptoPrice(currency);
//   const payoutCrypto = req.body.cryptoAmount * multiplier;

//   const wallet = await Wallet.findOne({ userId, currency });
//   wallet.balance += payoutCrypto;
//   await wallet.save();

//   const txHash = crypto.randomBytes(8).toString("hex");

//   await Transaction.create({
//     userId,
//     usdAmount: payoutCrypto * price,
//     cryptoAmount: payoutCrypto,
//     currency,
//     transactionType: "cashout",
//     transactionHash: txHash,
//     priceAtTime: price,
//     timestamp: new Date(),
//   });

//   res.json({ success: true, payoutCrypto });
// };

export const cashOut = async (req, res) => {
  const { userId, multiplier, currency, cryptoAmount } = req.body;

  const price = await getCryptoPrice(currency);
  const payoutCrypto = cryptoAmount * multiplier;

  const wallet = await Wallet.findOne({ userId, currency });

  // 🛑 Handle case where wallet doesn't exist
  if (!wallet) {
    return res.status(400).json({ message: "Wallet not found for user" });
  }

  wallet.balance += payoutCrypto;
  await wallet.save();

  const txHash = crypto.randomBytes(8).toString("hex");

  await Transaction.create({
    userId,
    usdAmount: payoutCrypto * price,
    cryptoAmount: payoutCrypto,
    currency,
    transactionType: "cashout",
    transactionHash: txHash,
    priceAtTime: price,
    timestamp: new Date(),
  });

  return res.json({ success: true, payoutCrypto });
};

