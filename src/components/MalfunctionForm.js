import React, { useState } from "react";
import { addFault } from "../services/faultService";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import "../styles/MalfunctionForm.css";
import { useUser } from "../context/UserContext";

const MalfunctionForm = () => {
  const [location, setLocation] = useState("חדר");
  const [roomNumber, setRoomNumber] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const newFault = {
        location,
        roomNumber,
        description,
        ownerUid: user?.uid || "unknown", // Replace with actual user ID if applicable
      };

      await addFault(newFault);
      setSuccess(true);
      setRoomNumber("");
      setDescription("");
    } catch (err) {
      setError("שגיאה בשליחת התקלה, נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">הוסף תקלה</h1>

      <label className="form-label">איפה התקלה</label>
      <SelectInput
        options={["חדר", "שלב א", "שלב ב"]}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <label className="form-label">באיזה חדר</label>
      <TextInput
        placeholder="מספר חדר"
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
      />

      <label className="form-label">תיאור כללי</label>
      <TextInput
        placeholder="תיאור התקלה"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline={true}
      />

      {success && <p className="success-message">התקלה נוספה בהצלחה!</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="form-buttons">
        <button
          className="btn confirm"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "שולח..." : "אשר"}
        </button>
        <button
          className="btn cancel"
          onClick={() => {
            setRoomNumber("");
            setDescription("");
          }}
        >
          בטל
        </button>
      </div>
    </div>
  );
};

export default MalfunctionForm;
