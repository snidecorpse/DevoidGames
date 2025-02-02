import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingSettings from "../components/FloatingSettings";
import Background from "../components/background"; // Import Three.js background
import "./Home.css";

const Home = () => {
  const [username, setUsername] = useState(""); // Store the username
  const navigate = useNavigate();

  const handlePlayClick = () => {
    if (username.trim() === "") {
      alert("Please enter a username!"); // Prevent empty usernames
      return;
    }

    console.log("Username:", username); // Do something with username
    navigate(`/game?user=${encodeURIComponent(username)}`); // Pass username to Game page
  };

  return (
    <div className="home-container">
      <Background /> {/* Three.js background */}
      <div className="hero">
        <h1>Welcome to GameName here</h1>
        <p>Your journey starts here. Enter your username:</p>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} // Save input to state
        />
        <button onClick={handlePlayClick}>PLAY</button>
      </div>

      {/* Attach Floating Settings */}
      <FloatingSettings />
    </div>
  );
};

export default Home;
