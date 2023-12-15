import React, { useState, useRef } from 'react';
import './RoundButton.css';

const RoundButton = ({ label, onClick, width, ...rest }) => {
  const [ripple, setRipple] = useState(false);
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;

    setRipple({ x: xPos, y: yPos });
    onClick && onClick();
  };

  const handleAnimationEnd = () => {
    setRipple(false);
  };

  // Add touch event handlers to prevent default touch actions
  const handleTouchStart = (e) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleClick(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      ref={buttonRef}
      className="round-button"

    >
      {label}
      {ripple && (
        <div
          className="ripple"
          style={{
            left: ripple.x + 'px',
            top: ripple.y + 'px',
          }}
          onAnimationEnd={handleAnimationEnd}
        />
      )}
    </button>
  );
};

export default RoundButton;
