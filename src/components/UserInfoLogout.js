import React from "react";
import { useUser } from "../context/UserContext";
import "../styles/UserInfoLogout.css";

const UserInfoLogout = () => {
  const { user, setUser } = useUser();
  const onLogout = () => {
    setUser(null);
  };
  return (
    <div className="user-info-container">
      <span className="user-name">שלום, {user?.name || "אורח"}</span>
      <button className="logout-button" onClick={onLogout}>
        התנתק
      </button>
    </div>
  );
};

export default UserInfoLogout;
