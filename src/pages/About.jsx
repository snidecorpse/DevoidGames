import "./About.css";
import React from "react";
import Constellation from "../components/background";

const About = () => {
  return (
    <div className="about-container">
      
      <Constellation />
      <h1>About Us</h1>
      <p>Hi! We are Aries Studios, a team of passionate developers who love making cool, interactive websites and video games. Enjoy your trip through our computer-generated stars!</p>
      
      <div className="social-links">
        <a href="https://https://github.com/snidecorpse/DevoidGames" target="_blank" rel="noopener noreferrer" className="social-button github"> </a>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-button x"> </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-button instagram"> </a>
      </div>
    </div>
    
  );
};

export default About;
