import "./About.css";
import React from "react";

const About = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <p>Welcome to our amazing app! We strive to create the best experience for our users.</p>
      
      <div className="social-links">
        <a href="https://https://github.com/snidecorpse/DevoidGames.com" target="_blank" rel="noopener noreferrer" className="social-button github"> </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-button x"> </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-button instagram"> </a>
      </div>
    </div>
  );
};

export default About;
