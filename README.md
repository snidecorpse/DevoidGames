
---

# Devoid Games – Challenge-Based MMO by Aries Studios - Made in 20 hours for SpartaHack X

Welcome to **Devoid Games**, a challenge-based multiplayer game presented by **Aries Studios**. This project is powered by **Vite**, **React**, **FireBase**, and **Three.js**, featuring custom art, procedural particle backgrounds, and unique 3D shaders. Players connect to the same live game session, track challenges and scores in real time, and can customize their in-game username.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Scripts](#scripts)
- [Gameplay](#gameplay)
- [Contact / Credits](#contact--credits)

---

## Overview
**Devoid Games** is a web-based challenge platform where multiple players join multiple quick party games, made to make real life games track easier, a quick way to start up a challange/game between your group anywhere, anytime with a simple website. 

For now it has one game - Taurus Trails (Hackathon edition) 

This game presents a challange reward game. Each player:
- Chooses a unique username.
- Competes on challenges.
- Submits personal scores, tracked on a shared scoreboard.
- Most score wins!
- The data is synced, so the results/scoreboard update for everyone. (Makes game tracking easy & gets you playing faster)

**All players** see the same “data” in real time made real with a robust firebase backend, complete with drifting constellations and a clean and easy to use interface, made performant with react.js (UI elements made with Threejs). 

---

## Features
- **Vite + React** for a fast, modern front-end development experience.
- **Three.js**-Clean UI powered by 3D backgrounds with custom shaders, starfields, and swirling constellation visuals (Constellations was also the theme for spartahack X).
- **Massively Multiplayer**: All players share the same game instance or room (with real-time data sync).
- **Customizable Usernames**: Each player can create a unique name that displays on the leaderboard (no need for accounts and passwords, our app tracks you with your unique username).
- **Challenge-Based Gameplay**: Dynamic or static challenges with scoring.  
- **Responsive UI**: Works anywhere. Adapts the 3D view, text, and components for various device sizes.

---

## Tech Stack
- **Front End**: 
  - [Vite](https://vitejs.dev/) – lightning-fast development bundler.  
  - [React](https://reactjs.org/) – component-based UI library.  
  - [Three.js](https://threejs.org/) – 3D rendering and scene management.  
  - [lil-gui](https://lil-gui.georgealways.com/) – for on-screen parameter tuning of 3D effects.
- **Back End / Data Sync**: 
  - [Firebase](https://firebase.google.com/) - chosen real-time database for storing challenge data, user info, etc.
- **Styling**:
  - CSS modules or global CSS (various `.css` files).
  - Custom fonts and assets (PNGs, SVGs).
- **Artwork & Shaders**:
  - Handcrafted images (`git.png`, `insta.png`, etc.) for icons.
  - Procedural starfields and constellation lines with additive blending, custom geometry, and more.

---

## Project Structure
A quick overview of the main folders and files within `ariesGame/`:

```
ariesGame/
├─ public/                # Public assets (favicon, manifest, etc.)
├─ src/
│  ├─ assets/            # Images, PNG, SVG, fonts, textures
│  │   ├─ git.png
│  │   ├─ insta.png
│  │   └─ ...
│  ├─ components/        # Reusable React + Three.js components
│  │   ├─ background.jsx  # Galaxy Background
│  │   ├─ background.css
│  │   ├─ constellation.jsx # Constellation & shimmer Background
│  │   ├─ constellation.css
│  │   ├─ aboutButton.jsx
│  │   └─ ...
│  ├─ pages/             # Page-level React components (Routes)
│  │   ├─ About.jsx
│  │   ├─ About.css
│  │   ├─ Game.jsx
│  │   ├─ Game.css
│  │   ├─ Home.jsx
│  │   ├─ Home.css
│  │   └─ ...
│  ├─ App.jsx            # Main entry point for your React app
│  ├─ App.css
│  ├─ firebase.js        # Firebase config, if applicable
│  ├─ main.jsx           # Vite's bootstrapping file
│  └─ index.css
├─ node_modules/
├─ package.json
├─ vite.config.js
└─ README.md (this file)
```
---

## Installation

1. **Clone** the repository:
   ```bash
   git clone https://github.com/YourUsername/DevoidGames.git
   cd DevoidGames/ariesGame
   ```
2. **Install dependencies** (using npm or yarn):
   ```bash
   npm install
   # or
   yarn
   ```
3. If using **Firebase** or other backends, add your config details to `firebase.js` or `.env` as needed.

---

## Running the App

Start a development server:
```bash
npm run dev
# or
yarn dev
```

- This should open a local dev server (e.g. http://127.0.0.1:5173/ or similar) with **hot reload** support from Vite.

For a production-ready build:
```bash
npm run build
npm run preview
```
- This builds your app into the `dist/` folder, then serves it locally at a preview URL.

## Gameplay (for now)

1. **Create / Join**: On load, players choose a **username** (stored in the game state or backend).
2. **Explore Challenges (Future implementation)**: A list of games or  scenarios appear on the **Game** page.  
3. **Score / Submit**: Each player can update thier info based on thier performance to solve or complete challenges, inputting their result (score, time, or solution).  
4. **Leaderboards**: The scoreboard updates in real time for **all** connected users, thanks to your data sync (e.g., Firebase).  
5. **Cosmic 3D Backdrop**: Enjoy **Three.js**-powered starfields, drifting constellations, or custom art while you play.

---

## Contact / Credits
- **Aries Studios**: A team of passionate developers who love making cool, interactive websites and video games. Enjoy your trip through our computer-generated stars!  
- Team of 4 engineers at Michigan State University.
- **Jayden Anderson, Tyler Burt, Taufiqul Khan, Rahil Joshi**

Enjoy your cosmic challenge adventure in **Devoid Games**! Feel free to fork and customize & add more games. Feedback and contributions are always welcome. 

---  

*Thank you for playing and supporting our challenge-based MMO project made in Spartahack in 20 hours!!!!!*
