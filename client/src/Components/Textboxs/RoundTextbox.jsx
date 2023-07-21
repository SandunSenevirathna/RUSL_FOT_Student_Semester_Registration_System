import React from 'react';

const RoundTextbox = ({ type, placeholder, width, ...rest }) => {
  return (
    <input
      type={type || 'text'} // Set the input type to the prop value or use 'text' as default
      placeholder={placeholder}
      style={{
        width:  '250px', // Set the width to the prop value or use a default value (200px)
        height:'30px',
        borderRadius: '10px', // Set the corner radius here
        padding: '8px 12px', // Add padding for better appearance
        border: '1px solid #ccc', // Add border to the textbox
        outline: 'none', // Remove the default focus outline
        fontSize: '18px',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        // Add any other custom styles you want to apply
        // ...rest, // Optionally, pass additional props
      }}
      {...rest}
    />
  );
};

export default RoundTextbox;
