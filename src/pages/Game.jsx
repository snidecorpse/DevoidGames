import React, { useState, useEffect } from "react";
import "./Game.css"; // Create this file for styles


function Game() {
  // Example state...
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState([]);

  const files = import.meta.glob('/src/assets/Challenges.txt', { as: 'raw' });

  files['/src/assets/Challenges.txt']().then((text) => {
    setChallenges(text.split('\n'));
  });

  /*
  Add button to change text file. *leave for now*
  Add minus score
  Change score auto advances to next item ?
  */


  // Function to add a new player score
  const addScore = (name, score) => {
    setLeaderboard(prevLeaderboard => {
      // Check if player exists, update score
      const existingPlayer = prevLeaderboard.find(entry => entry.name === name);
      if (existingPlayer) {
        return prevLeaderboard.map(entry =>
          entry.name === name ? { ...entry, score: entry.score + score } : entry
        );
      }
      // Add new player if not found
      return [...prevLeaderboard, { name, score }].sort((a, b) => b.score - a.score);
    });
  };

  const randIndex = () => {
    setCurrentIndex(Math.floor(Math.random() * challenges.length));
  };

  const incrementScore = (name) => {
    setLeaderboard((prev) =>
      prev
        .map((entry) =>
          entry.name === name ? { ...entry, score: entry.score + 100 } : entry
        )
        .sort((a, b) => b.score - a.score)
    );
  };

  return (
    <div className="game-container">
      <h1>Game Page</h1>
      <p>The game starts here! 🎮</p>

      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.name}: {entry.score}
            <button onClick={() => incrementScore(entry.name)}>+100</button>
          </li>
        ))}
      </ul>

      <h2>Current Item: {challenges[currentIndex]}</h2>
      <button onClick={randIndex}>Next Items</button>
    </div>
  );
}

export default Game;
