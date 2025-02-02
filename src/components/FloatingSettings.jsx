import React, { useState } from "react";
import "./FloatingSettings.css";

const FloatingSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customServerId, setCustomServerId] = useState("");

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
          <div className="settings-field">
            <label htmlFor="custom-server-id">
              Custom Server ID (WIP) --     
            </label>
            <input
              type="text"
              id="custom-server-id"
              value={customServerId}
              onChange={(e) => setCustomServerId(e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingSettings;
