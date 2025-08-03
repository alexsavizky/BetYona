import React, { useState } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import "../styles/SearchBar.css";

const categoryOptions = [
  { label: "לפי קטגוריה", value: "" },
  { label: "מיקום", value: "מיקום" },
  { label: "שעה", value: "שעה" },
  { label: "פקיד", value: "פקיד" }
];

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    onSearch(searchText, category);
  };

  return (
    <div className="search-bar">
      <TextInput
        placeholder="... חפש"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <SelectInput
        options={categoryOptions.map(opt => opt.label)}
        value={categoryOptions.find(opt => opt.value === category)?.label || "לפי קטגוריה"}
        onChange={(e) => {
          const selectedLabel = e.target.value;
          const selectedOption = categoryOptions.find(opt => opt.label === selectedLabel);
          setCategory(selectedOption ? selectedOption.value : "");
        }}
      />
      <button className="search-button" onClick={handleSearch}>
        חפש
      </button>
    </div>
  );
};

export default SearchBar;