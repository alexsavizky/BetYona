import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navigation.css";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <aside className="navigation">
      <nav className="nav-menu">
        <button className="nav-button" onClick={() => navigate("/MainPage")}>
          דיווח תקלות
        </button>
        <button className="nav-button" onClick={() => navigate("/unresolved")}>
          תקלות שלא טופלו
        </button>
        <button className="nav-button" onClick={() => navigate("/resolved")}>
          תקלות שטופלו
        </button>
        <button
          className="nav-button highlight"
          onClick={() => navigate("/all")}
        >
          כל התקלות
        </button>
      </nav>
    </aside>
  );
};

export default Navigation;
