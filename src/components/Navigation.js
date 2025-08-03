import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/Navigation.css";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  // Navigation buttons as a function for reuse
  const navButtons = (
    <>
      <button
        className={`nav-button${location.pathname === "/MainPage" ? " highlight" : ""}`}
        onClick={() => { setMenuOpen(false); navigate("/MainPage"); }}
      >
        דיווח תקלות
      </button>
      <button
        className={`nav-button${location.pathname === "/unresolved" ? " highlight" : ""}`}
        onClick={() => { setMenuOpen(false); navigate("/unresolved"); }}
      >
        תקלות שלא טופלו
      </button>
      <button
        className={`nav-button${location.pathname === "/resolved" ? " highlight" : ""}`}
        onClick={() => { setMenuOpen(false); navigate("/resolved"); }}
      >
        תקלות שטופלו
      </button>
      <button
        className={`nav-button${location.pathname === "/all" ? " highlight" : ""}`}
        onClick={() => { setMenuOpen(false); navigate("/all"); }}
      >
        כל התקלות
      </button>
      {user?.classification === 2 && (
        <button
          className={`nav-button${location.pathname === "/users" ? " highlight" : ""}`}
          onClick={() => { setMenuOpen(false); navigate("/users"); }}
        >
          ניהול משתמשים
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Hamburger icon for mobile */}
      <button
        className="hamburger-menu"
        onClick={() => setMenuOpen(true)}
        aria-label="פתח תפריט"
      >
        &#9776;
      </button>

      {/* Sidebar for desktop */}
      <aside className="navigation">
        <nav className="nav-menu">
          {navButtons}
        </nav>
      </aside>

      {/* Fullscreen overlay menu for mobile */}
      {menuOpen && (
        <div className="mobile-nav-overlay">
          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="סגור תפריט"
          >
            &times;
          </button>
          <nav className="nav-menu mobile-menu">
            {navButtons}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navigation;