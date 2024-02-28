import React from 'react';

const RoundTextbox = ({ type, placeholder, width, height, inputRef,onKeyDown, ...rest }) => {
  return (
    <input
      type={type || 'text'}
      placeholder={placeholder}
      style={{
        width: width || '250px',
        height: height || '50px',
        borderRadius: '30px',
        padding: '8px 22px',
        border: '1px solid #ccc',
        outline: 'none',
        fontSize: '18px',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
      }}
      ref={inputRef} // Use ref instead of inputRef
      onKeyDown={onKeyDown}
      {...rest}
    />
  );
};

export default RoundTextbox;
