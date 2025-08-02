import React, { useState } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import "../styles/SearchBar.css";

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
        options={["לפי קטגוריה", "מיקום", "שנה", "פקיד"]}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button className="search-button" onClick={handleSearch}>
        חפש
      </button>
    </div>
  );
};

export default SearchBar;
