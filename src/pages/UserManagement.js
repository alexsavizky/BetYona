import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const UserManagement = () => {
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [classification, setClassification] = useState("1");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      await addDoc(collection(db, "users"), {
        email,
        name,
        classification: Number(classification),
      });
      setSuccess("המשתמש נוסף בהצלחה!");
      setEmail("");
      setName("");
      setClassification("1");
    } catch (err) {
      setError("שגיאה בהוספת המשתמש");
    }
  };

  if (!user || user.classification !== 2) {
    return <div>אין לך הרשאה לצפות בדף זה.</div>;
  }

  return (
    <div className="user-management-container">
      <h2>הוספת משתמש חדש</h2>
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="שם"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select
          value={classification}
          onChange={(e) => setClassification(e.target.value)}
        >
          <option value="1">פקיד</option>
          <option value="2">מנהל</option>
        </select>
        <button type="submit">הוסף משתמש</button>
      </form>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default UserManagement;