import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { onSnapshot, collection, addDoc, updateDoc, doc, query, orderBy, arrayUnion  } from "firebase/firestore";
import "./Game.css"; // Create this file for styles
import db from "../firebase";


function Game() {
    
    
  const [currentIndex, setCurrentIndex] = useState(0);
   const [idea, setIdea] = useState("");

  const location = useLocation();
  // Safely retrieve the payload from location.state
  const payload = location.state?.payload;
  const docId = location.state?.docId;

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

  // Function to increment a player's score
  const incrementScore = (user) => {
    const userRef = doc(db, "Users", docId); // used to be db, "Users", user.id
    updateDoc(userRef, {
      score: payload.score + 100
    })
      .then(() => {
        console.log("User score updated in Firestore!");
        console.log(payload.score);
        console.log(docId);
        payload.score = payload.score + 100;
        randIndex()
        // No need to update local state manually; onSnapshot will reflect the changes.
      })
      .catch((error) => console.error("Error updating score: ", error))
  };

  const decrementScore = (user) => {
    const userRef = doc(db, "Users", docId); // used to be db, "Users", user.id
    updateDoc(userRef, {
      score: payload.score - 100
    })
      .then(() => {
        console.log("User score updated in Firestore!");
        console.log(payload.score);
        console.log(docId);
        payload.score = payload.score - 100;
        randIndex()
        // No need to update local state manually; onSnapshot will reflect the changes.
      })
      .catch((error) => console.error("Error updating score: ", error))
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

// Add a new idea to the Firestore array field
const handlePlayClick = async () => {
  if (!idea.trim()) {
    alert("Please enter a valid idea!");
    return;
  }

  const docRef = doc(db, "Challenges", "UGprOKmR8AdudS0FbVF6"); // Replace with your document ID
  try {
    await updateDoc(docRef, {
      challenges: arrayUnion(idea), // Add the new idea to the 'challenges' array
    });
    console.log("Idea added to Firestore!");
    setIdea(""); // Clear the input field
  } catch (error) {
    console.error("Error adding idea: ", error);
  }
};

return (
  <div className="game-wrapper"> {/* Wrapper to manage layout */}
    <div className="game-container">
      <h1>Taurus' Trials</h1>
    </div>

    <h3>Welcome, {payload.UserName}</h3> 

    <h2>Task: {challenges[currentIndex]}</h2>

    <div className="score-buttons">
      <button className="decrement" onClick={() => decrementScore(payload)}>-100</button>
      <button className="increment" onClick={() => incrementScore(payload)}>+100</button>
    </div>

    <div className="input-container">
      <input
        type="text"
        placeholder="Enter a challenge idea"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
      />
      <button onClick={handlePlayClick}>Submit Idea</button>
    </div>

    {/* Leaderboard moved to bottom */}
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((entry) => (
          <li key={entry.id}>
            {entry.UserName}: {entry.score}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

};

export default Game;