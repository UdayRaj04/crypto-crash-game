 import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
// import GameRound from "../models/GameRound.js";
import { getCryptoPrice } from "../services/priceService.js";
import crypto from "node:crypto";

// import crypto from "crypto";

// export const placeBet = async (req, res) => {
//   const { userId, usdAmount, currency } = req.body;
//   const price = await getCryptoPrice(currency);
//   const cryptoAmount = usdAmount / price;

//   const wallet = await Wallet.findOne({ userId, currency });
//   if (!wallet || wallet.balance < cryptoAmount) {
//     return res.status(400).json({ message: "Insufficient balance" });
//   }

//   wallet.balance -= cryptoAmount;
//   await wallet.save();

//   const txHash = crypto.randomBytes(8).toString("hex");

//   await Transaction.create({
//     userId,
//     usdAmount,
//     cryptoAmount,
//     currency,
//     transactionType: "bet",
//     transactionHash: txHash,
//     priceAtTime: price,
//     timestamp: new Date(),
//   });

//   res.json({ success: true, cryptoAmount });
// };

// // export const cashOut = async (req, res) => {
// //   const { userId, multiplier, currency } = req.body;
// //   const price = await getCryptoPrice(currency);
// //   const payoutCrypto = req.body.cryptoAmount * multiplier;

// //   const wallet = await Wallet.findOne({ userId, currency });
// //   wallet.balance += payoutCrypto;
// //   await wallet.save();

// //   const txHash = crypto.randomBytes(8).toString("hex");

// //   await Transaction.create({
// //     userId,
// //     usdAmount: payoutCrypto * price,
// //     cryptoAmount: payoutCrypto,
// //     currency,
// //     transactionType: "cashout",
// //     transactionHash: txHash,
// //     priceAtTime: price,
// //     timestamp: new Date(),
// //   });

// //   res.json({ success: true, payoutCrypto });
// // };

// export const cashOut = async (req, res) => {
//   const { userId, multiplier, currency, cryptoAmount } = req.body;

//   const price = await getCryptoPrice(currency);
//   const payoutCrypto = cryptoAmount * multiplier;

//   const wallet = await Wallet.findOne({ userId, currency });

//   // 🛑 Handle case where wallet doesn't exist
//   if (!wallet) {
//     return res.status(400).json({ message: "Wallet not found for user" });
//   }

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

//   return res.json({ success: true, payoutCrypto });
// };




import GameRound from "../models/GameRound.js";

export const placeBet = async (req, res) => {
  const { userId, usdAmount, currency } = req.body;

  if (!userId || usdAmount <= 0) {
    return res.status(400).json({ message: "Invalid bet input" });
  }

  const price = await getCryptoPrice(currency);
  const cryptoAmount = usdAmount / price;

  const wallet = await Wallet.findOne({ userId, currency });
  if (!wallet || wallet.balance < cryptoAmount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  // Get the current round
  const round = await GameRound.findOne({ endTime: null }).sort({ startTime: -1 });
  if (!round) {
    return res.status(400).json({ message: "No active round found" });
  }

  // Prevent duplicate bets in same round
  const alreadyBet = round.bets.find(bet => bet.userId === userId);
  if (alreadyBet) {
    return res.status(400).json({ message: "Already placed a bet in this round" });
  }

  // Deduct and save wallet
  wallet.balance -= cryptoAmount;
  await wallet.save();

  // Add bet to current round
  round.bets.push({ userId, usdAmount, cryptoAmount, currency });
  await round.save();

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

  return res.json({ success: true, cryptoAmount });
};

export const cashOut = async (req, res) => {
  const { userId, multiplier, currency } = req.body;

  if (!userId || !multiplier || multiplier <= 1) {
    return res.status(400).json({ message: "Invalid cashout request" });
  }

  // Get current round
  const round = await GameRound.findOne({ endTime: null }).sort({ startTime: -1 });
  if (!round) {
    return res.status(400).json({ message: "No active round" });
  }

  const playerBet = round.bets.find(b => b.userId === userId);
  if (!playerBet) {
    return res.status(400).json({ message: "No bet found for user in this round" });
  }

  // Prevent double cashout
  if (playerBet.cashedOut) {
    return res.status(400).json({ message: "Already cashed out" });
  }

  // Ensure game hasn't crashed yet
  const now = new Date();
  if (round.crashPoint && multiplier >= round.crashPoint) {
    return res.status(400).json({ message: "Game already crashed" });
  }

  const payoutCrypto = playerBet.cryptoAmount * multiplier;

  // Update user wallet
  const wallet = await Wallet.findOne({ userId, currency });
  if (!wallet) {
    return res.status(400).json({ message: "Wallet not found" });
  }

  wallet.balance += payoutCrypto;
  await wallet.save();

  // Mark cashout in round
  playerBet.cashedOut = true;
  playerBet.cashoutMultiplier = multiplier;
  playerBet.payoutCrypto = payoutCrypto;
  playerBet.cashoutTime = now;
  await round.save();

  const price = await getCryptoPrice(currency);
  const txHash = crypto.randomBytes(8).toString("hex");

  await Transaction.create({
    userId,
    usdAmount: payoutCrypto * price,
    multiplier,
    cryptoAmount: payoutCrypto,
    currency,
    transactionType: "cashout",
    transactionHash: txHash,
    priceAtTime: price,
    
    timestamp: now,
  });

  return res.json({ success: true, payoutCrypto ,multiplier });
};

