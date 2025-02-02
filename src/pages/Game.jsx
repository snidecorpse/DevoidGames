import React, { useState, useEffect } from "react";
import "./Game.css"; // Create this file for styles


function Game() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState([]);

  const files = import.meta.glob('/src/assets/Challenges.txt', { as: 'raw' });

  files['/src/assets/Challenges.txt']().then((text) => {
    setChallenges(text.split('\n'));
  });

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

  // Function to increment a player's score
  const incrementScore = (name) => {
    setLeaderboard(prevLeaderboard =>
      prevLeaderboard.map(entry =>
        entry.name === name ? { ...entry, score: entry.score + 100 } : entry
      ).sort((a, b) => b.score - a.score)
    );
  };

  const randIndex = () => {
    setCurrentIndex(Math.floor((Math.random() * challenges.length)));
    console.log(currentIndex);
  }


  useEffect(() => {
    setLeaderboard([
      { name: 'John', score: 0 },
      { name: 'Jane', score: 0 }
    ].sort((a, b) => b.score - a.score));
  }, []);

  return (
    <>
    <div className="game-container">
      <h1>Game Page</h1>
      <p>The game starts here! 🎮</p>
    </div>

    
    <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.name}: {entry.score}
            <button onClick={() => incrementScore(entry.name)}>+100</button>
          </li>
        ))}
      </ul>

      <h2>Current Item: {challenges[currentIndex]}</h2>
        <button onClick={() => randIndex()}>
          Next Items
      </button>
    </>
  );
};

export default Game;
