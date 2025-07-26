import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import gameRoutes from "./routes/gameRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import { startCrashGame } from "./services/crashEngine.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/game", gameRoutes);
app.use("/api/wallet", walletRoutes);
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("disconnect", () => console.log("Disconnected:", socket.id));
});

startCrashGame(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
