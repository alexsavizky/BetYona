import React from "react";
import "../styles/CustomButton.css"; // Importing the CSS file for styling

const CustomButton = ({ text, onClick }) => {
  return (
    <button className="custom-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default CustomButton;
