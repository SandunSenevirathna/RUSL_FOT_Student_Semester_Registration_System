import React, { useState } from 'react';
import './CustomButton.css'; // Import your CSS file for styling

const CustomButton = ({ onClick, title, backgroundColor, borderRadius, width, height, disabled }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePress = () => {
        if (!disabled) {
            setIsPressed(true);
            setTimeout(() => {
                setIsPressed(false);
                onClick(); // Call the original onClick function
            }, 100);
        }
    };

    const CustomButtonStyle = {
        backgroundColor: backgroundColor || '#333333',
        borderRadius: borderRadius || 30,
        transform: isPressed ? 'scale(0.9)' : 'scale(1)',
        outline: 'none',
        width: width || 'auto',
        height: height || 'auto',
        cursor: disabled ? 'not-allowed' : 'pointer', // Change cursor style based on disabled state
        opacity: disabled ? 0.6 : 1, // Reduce opacity for disabled state
    };

    return (
        <div className={`button-container ${isPressed ? 'pressed' : ''}`} onClick={handlePress} style={CustomButtonStyle}>
            <span className="button-text">{title}</span>
        </div>
    );
};

export default CustomButton;
