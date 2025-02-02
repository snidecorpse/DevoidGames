import React, { useState, useEffect } from "react";

function Game() {
  // Example state...
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1) Reload logic
  useEffect(() => {
    // Get how many times we've reloaded so far
    const reloadCount = parseInt(sessionStorage.getItem("reloadCount")) || 0;

    if (reloadCount < 2) {
      // Increment count
      sessionStorage.setItem("reloadCount", reloadCount + 1);
      // Reload the page
      window.location.reload();
    } else {
      // We have reloaded 2 times already, so reset or remove the counter
      sessionStorage.removeItem("reloadCount");
    }
  }, []);

  // 2) Load your text file or do normal logic
  useEffect(() => {
    // This is just a naive example for demonstration
    const files = import.meta.glob("/src/assets/Challenges.txt", { as: "raw" });
    files["/src/assets/Challenges.txt"]().then((text) => {
      setChallenges(text.split("\n"));
    });

    // Set an example leaderboard
    setLeaderboard([
      { name: "John", score: 0 },
      { name: "Jane", score: 0 }
    ]);
  }, []);

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
