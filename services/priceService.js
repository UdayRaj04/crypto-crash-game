import axios from "axios";

let cachedPrices = {};
let lastFetched = 0;

export const getCryptoPrice = async (currency) => {
  const now = Date.now();
  if (now - lastFetched < 10000 && cachedPrices[currency]) {
    return cachedPrices[currency];
  }

  try {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd`
    );
    cachedPrices = {
      BTC: res.data.bitcoin.usd,
      ETH: res.data.ethereum.usd,
    };
    lastFetched = now;
    return cachedPrices[currency];
  } catch (err) {
    console.error("Error fetching price:", err.message);
    return cachedPrices[currency] || 0;
  }
};
