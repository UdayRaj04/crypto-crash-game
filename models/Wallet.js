// import mongoose from "mongoose";

// const walletSchema = new mongoose.Schema({
//   userId: mongoose.Schema.Types.ObjectId,
//   currency: String, // BTC or ETH
//   balance: Number,
// });

// export default mongoose.model("Wallet", walletSchema);
// models/Wallet.js
import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  userId: {
    type: String,  // ✅ Change from mongoose.Schema.Types.ObjectId to String
    required: true,
  },
  currency: String, // BTC or ETH
  balance: {
    type: Number,
    required: true,
  },
  // ... other fields
});

export default mongoose.model("Wallet", walletSchema);
