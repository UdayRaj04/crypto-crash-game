import mongoose from "mongoose";

const txSchema = new mongoose.Schema({
  userId: {
    type: String, // ✅ changed from mongoose.Schema.Types.ObjectId
    required: true,
  },
  usdAmount: Number,
  cryptoAmount: Number,
  currency: String,
  transactionType: String, // bet or cashout
  transactionHash: String,
  priceAtTime: Number,
  multiplier: Number,
  timestamp: Date,
});

export default mongoose.model("Transaction", txSchema);
