import React from "react";
import "../styles/Header.css";
import { useUser } from "../context/UserContext";

const Header = () => {
  const { user, setUser } = useUser();
  const onLogout = () => {
    setUser(null);
  };
  return (
    <header className="header">
      <div className="icons-con">
        <img src="icon1.png" alt="Logo Bet Yona" className="logo1" />
        <img src="icon2.png" alt="Logo2 Bet Yona" className="logo2" />
      </div>

      <h1>בית יונה מערכת תחזוקה</h1>
      {user ? (
        <div className="user-info">
          <span className="user-name">שלום, {user?.name || "אורח"}</span>
          <button className="logout-button" onClick={onLogout}>
            התנתק
          </button>
        </div>
      ) : (
        <p></p>
      )}
    </header>
  );
};

export default Header;
