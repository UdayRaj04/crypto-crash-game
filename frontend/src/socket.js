import { io } from "socket.io-client";

const socket = io(
    "https://crypto-crash-game-nvw3.onrender.com"
);

export default socket;
