import { generateCrashPoint } from "../utils/fairCrash.js";
import GameRound from "../models/GameRound.js";

let roundId = 0;
const seed = "supersecureseed";

export const startCrashGame = (io) => {
  setInterval(async () => {
    roundId++;
    const crashPoint = generateCrashPoint(seed, roundId);
    const startTime = new Date();

    const round = await GameRound.create({
      roundId,
      crashPoint,
      startTime,
      bets: [],
    });

    io.emit("round_start", { roundId, crashPoint });

    let multiplier = 1.0;
    const interval = setInterval(() => {
      multiplier += 0.05;
      io.emit("multiplier_update", { multiplier });

      if (multiplier >= crashPoint) {
        clearInterval(interval);
        io.emit("round_crash", { roundId, crashPoint });
        round.endTime = new Date();
        round.save();
      }
    }, 100);
  }, 10000);
};
