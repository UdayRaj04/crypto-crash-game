import crypto from "crypto";

export const generateCrashPoint = (seed, roundId) => {
  const hash = crypto.createHash("sha256").update(seed + roundId).digest("hex");
  const num = parseInt(hash.slice(0, 13), 16);
  const crash = Math.max(1, (num % 10000) / 1000);
  return parseFloat(crash.toFixed(2));
};
