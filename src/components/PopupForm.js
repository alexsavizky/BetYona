// src/PopupForm.js
import React, { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { useUser } from "../context/UserContext";
import { db, addDoc, collection } from "../firebase";
import "../styles/PopupForm.css";

function PopupForm() {
  const add_fault = "הוסף תקלה";
  const where_fault = "איפה התקלה";
  const buildingB = "שלב ב";
  const buildingA = "שלב א";
  const room = "חדר";
  const whereFaultSpecific = "באיזה חדר";
  const add_comment_title = "הוסף הערה";
  const description = "תיאור התקלה";
  const add_comment = "הוסף הערה שתעזור להבין איפה התקלה";
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false); // State for popup visibility
  const [formData, setFormData] = useState({
    name: "",
    category: "room",
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form data to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Map location to database format
      const locationMapping = {
        room: 0,
        buildingA: 1,
        buildingB: 2,
      };

      // Prepare the data to match the database schema
      const submissionData = {
        location: locationMapping[formData.category], // Map category to location enum
        room_number: formData.name, // room_number is name
        date_time: Timestamp.now(), // Current timestamp
        owner_uid: user?.uid || "unknown", // Owner UID from UserContext
        description: formData.description, // Form description
      };

      // Add data to the "fault" collection
      await addDoc(collection(db, "fault"), submissionData);

      alert("Form submitted successfully!");
      setIsOpen(false); // Close popup after submission
      setFormData({
        name: "",
        category: "room", // Reset category to default value
        description: "",
      }); // Reset form
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error submitting form");
    }
  };

  return (
    <div className="popup-container">
      {/* Button to open the popup */}
      <button className="open-popup-btn" onClick={() => setIsOpen(true)}>
        {add_fault}
      </button>

      {/* Popup Form */}
      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>{add_fault}</h2>
            <form onSubmit={handleSubmit}>
              {/* Select Option */}
              <label>
                {where_fault}
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="room">{room}</option>
                  <option value="buildingA">{buildingA}</option>
                  <option value="buildingB">{buildingB}</option>
                </select>
              </label>
              {/* Text Input */}
              <label>
                {formData.category === "room"
                  ? whereFaultSpecific
                  : add_comment_title}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={
                    formData.category === "room"
                      ? whereFaultSpecific
                      : add_comment
                  }
                  required
                />
              </label>
              {/* Text Input */}
              <label>
                {description}
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={description}
                  required
                />
              </label>
              {/* Submit and Close Buttons */}
              <div className="form-buttons">
                <button type="submit">Submit</button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="close-popup-btn"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopupForm;
