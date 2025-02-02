import React, { useState } from "react";
import { onSnapshot, collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import FloatingSettings from "../components/FloatingSettings";
import Background from "../components/background"; // Import Three.js background
import "./Home.css";
import db from "../firebase";

const Home = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handlePlayClick = async () => {
    if (username.trim() === "") {
      alert("Please enter a username!");
      return;
    }

    // Prepare your payload
    const payload = { UserName: username, score: 0 };

    // Add the document to Firebase
    try {
      const docRef = await addDoc(collection(db, "Users"), payload);
      const docId = docRef.id; // This is the document ID

      // Now navigate to the Game component and pass both the payload and the docId as state
      navigate("/game", { state: { payload, docId } });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="home-container">
      <Background /> {/* Three.js background */}
      <div className="hero">
       <h1>Devoid Games</h1>
        <p>Enter your username:</p>
        <input 
          type="text" 
          placeholder="USERNAME" 
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
