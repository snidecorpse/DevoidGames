import React from "react";
import { Link } from "react-router-dom"; // Ensure you have react-router-dom installed
import "./aboutButton.css";

const AboutButton = () => {
  return (
    <div className="about-button">
      <Link to="/about">About us</Link>
    </div>
  );
};

export default AboutButton;
