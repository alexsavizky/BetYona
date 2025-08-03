import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import TextInput from "../components/TextInput";
import "../styles/AllFaults.css";
import "../styles/MainPage.css";
import "../styles/MalfunctionForm.css";
import SelectInput from "../components/SelectInput";

const UserManagement = () => {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [classification, setClassification] = useState("0");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const usersArr = snapshot.docs.map(doc => ({
        id: doc.data().id,
        name: doc.data().name,
        classification: doc.data().classification,
        docId: doc.id,
      }));
      setUsers(usersArr);
    };
    fetchUsers();
  }, [success]); // refetch on successful add

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (userId.length !== 9) {
      setError("יש להזין תעודת זהות בת 9 ספרות בלבד");
      return;
    }
    try {
      // Check if ID already exists
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("id", "==", userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError("תעודת זהות זו כבר קיימת במערכת");
        return;
      }

      await addDoc(usersRef, {
        name,
        id: userId,
        classification: Number(classification),
      });
      setSuccess("המשתמש נוסף בהצלחה!");
      setName("");
      setUserId("");
      setClassification("0");
    } catch (err) {
      setError("שגיאה בהוספת המשתמש");
    }
  };

  if (!user || user.classification !== 2) {
    return <div>אין לך הרשאה לצפות בדף זה.</div>;
  }

  // Helper to display classification as text
  const getClassificationText = (val) => {
    if (val === 0 || val === "0") return "פקיד";
    if (val === 1 || val === "1") return "אחזקה";
    if (val === 2 || val === "2") return "מנהל";
    return val;
  };

  return (
    <div className="app-container">
      <Header />
      <div className="no-header">
        <Navigation />
        <div className="content">
          <div className="form-container">
            <h2 className="form-title">הוספת משתמש חדש</h2>
            <form className="user-form" onSubmit={handleAddUser}>
              <TextInput
                placeholder="שם משתמש"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextInput
                placeholder="תעודת זהות (9 ספרות)"
                value={userId}
                onChange={(e) => setUserId(e.target.value.replace(/\D/g, ""))}
                maxLength={9}
                required
              />
              <SelectInput
                options={["פקיד", "אחזקה", "מנהל"]}
                value={
                  classification === "0"
                    ? "פקיד"
                    : classification === "1"
                    ? "אחזקה"
                    : "מנהל"
                }
                onChange={(e) => {
                  const value =
                    e.target.value === "פקיד"
                      ? "0"
                      : e.target.value === "אחזקה"
                      ? "1"
                      : "2";
                  setClassification(value);
                }}
                required
              />
              <button className="btn confirm" type="submit">
                הוסף משתמש
              </button>
            </form>
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}

            {/* Users Table */}
            <h3 style={{ marginTop: "2em" }}>כל המשתמשים</h3>
            <table className="data-table" style={{ margin: "0 auto", width: "100%", maxWidth: 600 }}>
              <thead>
                <tr>
                  <th>שם</th>
                  <th>תעודת זהות</th>
                  <th>סיווג</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.docId}>
                    <td>{u.name}</td>
                    <td>{u.id}</td>
                    <td>{getClassificationText(u.classification)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default  UserManagement;