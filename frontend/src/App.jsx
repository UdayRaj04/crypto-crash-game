import React, { useState, useEffect } from "react";
import Wallet from "./components/Wallet";
import Game from "./components/Game";
import './App.css';

const App = () => {
  const [userId, setUserId] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  return (
    <div className="container">
      <h1 className="title">🚀 Crypto Crash Game</h1>
      
      <div className="tog">
        <button onClick={() => setDarkMode(!darkMode)}>
          Toggle {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="input-group">
        <div className="start">
          <h3>Add User ID to start</h3>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
          />
          <h3>After Adding User ID, click Add Cash</h3>
        </div>

        <div>
          <Wallet userId={userId} />
        </div>
      </div>

      <Game userId={userId} />
    </div>
  );
};

export default App;
