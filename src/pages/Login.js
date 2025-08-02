import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../context/UserContext";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import "../styles/Login.css";
const Login = () => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Query Firestore for the user with a matching `id` field
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("id", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the first matching document
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Set the user in the context
        await setUser({ uid: userDoc.id, ...userData });

        // Navigate to the dashboard
        await navigate("/MainPage");
      } else {
        setError("טעות בתעודת זהות נסה עוד פעם בבקשה");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("אופס היה איזה טעות נסה עוד פעם להתחבר");
    }
  };

  return (
    <div className="app-container">
      <Header></Header>
      <div className="login-page">
        <h1>כניסה למערכת</h1>
        <p>הכנס תעודת זהות:</p>
        <TextInput
          placeholder="11111111"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        ></TextInput>
        <br></br>
        <CustomButton text="היכנס" onClick={handleLogin} />

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
