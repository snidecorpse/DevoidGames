import React from "react";
import FloatingSettings from "../components/FloatingSettings";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>Welcome to GameName here</h1>
        <p>Your journey starts here. Enter your username:</p>
        <input type="text" placeholder="Username" />
        <button>PLAY</button>
      </div>

      {/* Attach the Floating Settings Button */}
      <FloatingSettings />
    </div>
  );
};

export default Home;
