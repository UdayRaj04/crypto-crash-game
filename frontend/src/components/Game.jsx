import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

const BASE_URL =  "https://crypto-crash-game-nvw3.onrender.com";

const Game = ({ userId }) => {
  const currency = "BTC";
  const [log, setLog] = useState([]);
  const [multiplier, setMultiplier] = useState(1.0);
  const [status, setStatus] = useState("waiting");
  const [balance, setBalance] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [cryptoAmount, setCryptoAmount] = useState(null);

  const fetchBalance = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/wallet/${userId}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setBalance(res.data[0].balance);
      }
    } catch {
      logMsg("❌ Failed to fetch balance");
    }
  };

  const logMsg = (msg) => setLog((prev) => [msg, ...prev.slice(0, 19)]);

  const addCash = async () => {
    try {
      await axios.post(`${BASE_URL}/api/wallet/add`, {
        userId,
        currency,
        amount: 10,
      });
      logMsg("💵 Added $10 to wallet");
      fetchBalance();
    } catch {
      logMsg("❌ Failed to add cash");
    }
  };

  const placeBet = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/game/bet`, {
        userId,
        usdAmount: Number(betAmount),
        currency,
      });
      const credited = res.data.cryptoAmount;
      setCryptoAmount(credited);
      logMsg(`🎯 Bet Placed: $${betAmount} → cashout`);
      fetchBalance();
    } catch (err) {
      logMsg("❌ Bet failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const cashOut = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/game/cashout`, {
        userId,
        multiplier,
        cryptoAmount,
        currency,
      });
      logMsg(`🏆 Cashed out: ${res.data.payoutCrypto.toFixed(8)} ${currency}  at Multipliex: ${multiplier}x`);
      setCryptoAmount(null);
      fetchBalance();
    } catch (err) {
      logMsg("❌ Cashout failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  useEffect(() => {
    fetchBalance();

    socket.on("round_start", () => {
      setStatus("running");
      setMultiplier(1.0);
      logMsg("🔄 Round started");
    });

    socket.on("multiplier_update", (data) => {
      setMultiplier(data.multiplier);
    });

    socket.on("round_crash", (data) => {
      setStatus("crashed");
      logMsg("💥 CRASH at x" + data.crashPoint);
    });

    return () => {
      socket.off("round_start");
      socket.off("multiplier_update");
      socket.off("round_crash");
    };
  }, [userId]);

  return (
    <div className="card2">
    <div>
      <h2>🎮 Game Panel</h2>
      <p>Status: <strong>{status}</strong></p>
      <p className="multiplier">x{multiplier.toFixed(2)}</p>

      <div className="button-group">
        <button onClick={fetchBalance}>🔄 Refresh</button>
        <button onClick={addCash}>➕ Add $10</button>
      </div>

      <div className="balance-info">
        <p>💼 Balance: <strong>${balance?.toFixed(2) || "0.00"}</strong></p>
        {cryptoAmount && (
          <p className="crypto-info">✅ Bet: {cryptoAmount.toFixed(8)} {currency}</p>
        )}
      </div>

      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        placeholder="Enter bet amount"
      />
      <button onClick={placeBet}>🎲 Place Bet</button>
      <button onClick={cashOut} disabled={!cryptoAmount}>💰 Cash Out</button>
      </div>

      <div className="log">
      <h3>Game Logs---------</h3>
        {log.map((entry, idx) => <div key={idx}>{entry}</div>)}
      </div>
    </div>
  );
};

export default Game;
