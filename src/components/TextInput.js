import React from "react";
import "../styles/TextInput.css";

const TextInput = ({ placeholder, value, onChange, multiline = false }) => {
  return multiline ? (
    <textarea
      className="custom-input textarea-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={3}
    />
  ) : (
    <input
      type="text"
      className="custom-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default TextInput;
