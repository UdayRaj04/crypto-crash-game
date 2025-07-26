# 🧨 Crypto Crash Game (Backend)

An online real-time multiplayer crash game where players bet in USD, converted to crypto, and try to cash out before the multiplier crashes.

---

## 🚀 Features

- Real-time **multiplier growth and crash**
- Provably fair crash point generation
- **Crypto price conversion** using CoinGecko API
"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
- USD ↔ BTC/ETH conversion
- Wallet system with balance tracking
- Real-time updates via **Socket.IO**
- REST API for placing bets, cashouts, checking balances , add balances
- MongoDB (Atlas ready)

---

## ⚙️ Tech Stack

- Node.js + Express
- Socket.IO (WebSockets)
- MongoDB + Mongoose
- CoinGecko API
- Crypto module for secure randomness

---

## 📦  See Game Live

- http://localhost:5000/client.html



## 📦 get cash




## 📦 post addcash

 

## 📦 post bet



## 📦 post cashout




## 📦 Installation
- change  in .env
- MONGO_URI=   your mongodburl

```bash
git clone https://github.com/yourusername/crypto-crash-game.git
cd crypto-crash-game
npm install
npm run dev
---



