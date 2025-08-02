import React from "react";
import "../styles/TextInput.css"; // Reusing the same styles as TextInput

const SelectInput = ({ options, value, onChange }) => {
  return (
    <select className="custom-input" value={value} onChange={onChange}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;
