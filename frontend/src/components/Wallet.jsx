import React, { useEffect, useState } from "react";
import axios from "axios";

const Wallet = ({ userId }) => {
  const [wallet, setWallet] = useState(null);

  const fetchWallet = async () => {
    try {
      const res = await axios.get(`https://crypto-crash-game-nvw3.onrender.com/api/wallet/${userId}`);
      if (Array.isArray(res.data)) {
        setWallet(res.data[0]);
      }
    } catch (err) {
      console.error("Wallet fetch error", err);
    }
  };

  useEffect(() => {
    fetchWallet(); // initial load

    const interval = setInterval(() => {
      fetchWallet();
    }, 5000); // fetch every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [userId]);

  return (
    <div className="card">
      <h2>💼 Wallet (reload in 5 sec)</h2>
      {wallet ? (
        <>
          <p>Currency: {wallet.currency}</p>
          <p>Balance: {wallet.balance.toFixed(6)}</p>
          <p>USD Equivalent: ${wallet.usdEquivalent}</p>
        </>
      ) : (
        <p>Loading wallet or not found for ID: {userId}</p>
      )}
    </div>
  );
};

export default Wallet;
