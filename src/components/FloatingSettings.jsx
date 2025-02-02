import React, { useState } from "react";
import "./FloatingSettings.css";

const FloatingSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  /**
   * Toggle the 'Mute' setting, which mutes/unmutes all
   * audio and video elements on the page.
   */
  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev);

    // Mute or unmute all <audio> and <video> elements
    const mediaElements = document.querySelectorAll("audio, video");
    mediaElements.forEach((media) => {
      media.muted = !media.muted;
    });
  };

  return (
    <>
      {/* Floating Button (spinning gear icon) */}
      <div
        className="floating-settings"
        onClick={() => setIsOpen((prev) => !prev)}
      />

      {/* Conditionally render the corner settings menu */}
      {isOpen && (
        <div className="settings-menu">
          <h2>Settings</h2>
          
          <button className="mute-btn" onClick={handleMuteToggle}>
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>
      )}
    </>
  );
};

export default FloatingSettings;
