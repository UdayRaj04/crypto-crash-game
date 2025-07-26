import mongoose from "mongoose";

const gameRoundSchema = new mongoose.Schema({
  roundId: Number,
  crashPoint: Number,
  bets: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      usdAmount: Number,
      cryptoAmount: Number,
      currency: String,
      cashoutMultiplier: Number,
      outcome: String,
    },
  ],
  startTime: Date,
  endTime: Date,
});

export default mongoose.model("GameRound", gameRoundSchema);
