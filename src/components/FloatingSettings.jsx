import React, { useState } from "react";
import { FaCog } from "react-icons/fa";
import "./FloatingSettings.css";

const FloatingSettings = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="floating-settings" onClick={() => setIsOpen(true)}>
      </div>

      {/* Settings Menu (Modal) */}
      {isOpen && (
        <div className="settings-modal">
          <div className="settings-content">
            <h2>Settings</h2>
            <p>Adjust your preferences here.</p>

            {/* Close Button */}
            <button className="close-btn" onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingSettings;
