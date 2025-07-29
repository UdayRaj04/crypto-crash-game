import { io } from "socket.io-client";

const socket = io(
  window.location.hostname ===
   "localhost"
    ? "http://localhost:5000"
    : 
    "https://crypto-crash-game-nvw3.onrender.com"
);

export default socket;
