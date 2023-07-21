import React from 'react';

const RoundButton = ({ label, onClick, width, ...rest }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: width || '150px', // Set the width to the prop value or use a default value (150px)
        height: '40px',
        borderRadius: '20px', // Set the corner radius here
        padding: '8px 12px', // Add padding for better appearance
        border: 'none', // Remove the default button border
        outline: 'none', // Remove the default focus outline
        backgroundColor: '#000000', // Set the background color of the button
        color: '#fff', // Set the text color of the button
        fontSize: '14px',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 700,
        cursor: 'pointer',
        // Add any other custom styles you want to apply
        // ...rest, // Optionally, pass additional props
      }}
      {...rest}
    >
      {label}
    </button>
  );
};

export default RoundButton;
