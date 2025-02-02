import React, { useState, useEffect } from "react";
import { onSnapshot, collection, addDoc, updateDoc, doc, query, orderBy } from "firebase/firestore";
// import "./Game.css"; // Create this file for styles
import db from "../firebase";


function Game() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [leaderboard, setLeaderboard] = useState([]);
  // const [challenges, setChallenges] = useState([]);

  // const files = import.meta.glob('/src/assets/Challenges.txt', { as: 'raw' });

  // files['/src/assets/Challenges.txt']().then((text) => {
  //   setChallenges(text.split('\n'));
  // });

  const [challenges, setChallenges] = useState([]); // Fixed typo

  useEffect(() => {
    // Subscribe to the Firestore collection
    const unsubscribe = onSnapshot(collection(db, "Challenges"), (snapshot) => {
      // Extract the 'challenges' array from each document
      const challengesData = snapshot.docs
        .map((doc) => doc.data().challenges || []) // Fallback to empty array if field missing
        .flat(); // Flatten array of arrays into a single array

      setChallenges(challengesData);
    });

    // Cleanup the subscription on unmount
    return unsubscribe;
  }, []);

  /*
  Add button to change text file. *leave for now*
  Add minus score
  Change score auto advances to next item ?
  */


  // Function to add a new player score
  // const addScore = (name, score) => {
  //   setLeaderboard(prevLeaderboard => {
  //     // Check if player exists, update score
  //     const existingPlayer = prevLeaderboard.find(entry => entry.name === name);
  //     if (existingPlayer) {
  //       return prevLeaderboard.map(entry =>
  //         entry.name === name ? { ...entry, score: entry.score + score } : entry
  //       );
  //     }
  //     // Add new player if not foundlea
  //     return [...prevLeaderboard, { name, score }].sort((a, b) => b.score - a.score);
  //   });
  // };

  // Function to increment a player's score
  const incrementScore = (user) => {
    const userRef = doc(db, "Users", user.id);
    updateDoc(userRef, {
      score: user.score + 100
    })
      .then(() => {
        console.log("User score updated in Firestore!");
        // No need to update local state manually; onSnapshot will reflect the changes.
      })
      .catch((error) => console.error("Error updating score: ", error));
  };

    // // Function to decrement a player's score
    // const decrementScore = (name) => {
    //   setLeaderboard(prevLeaderboard =>
    //     prevLeaderboard.map(entry =>
    //       entry.name === name ? { ...entry, score: entry.score - 100 } : entry
    //     ).sort((a, b) => b.score - a.score)
    //   );
    // };
  
  const randIndex = () => {
    setCurrentIndex(Math.floor((Math.random() * challenges.length)));
    console.log(currentIndex);
  }


  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const usersQuery = query(
      collection(db, "Users"),
      orderBy("score", "desc")
    );
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLeaderboard(users);
    });
    return unsubscribe;
  }, []);

  return (
    <>
    <div className="game-container">
      <h1>Game Page</h1>
      <p>The game starts here! 🎮</p>
    </div>

    
    <ul>
  {leaderboard.map((entry) => (
    <li key={entry.id}>
      {entry.UserName}: {entry.score}
      <button onClick={() => incrementScore(entry)}>+100</button>
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