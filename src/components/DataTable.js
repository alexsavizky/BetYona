import React from "react";
import "../styles/DataTable.css";
import { useUser } from "../context/UserContext"; // Add this import
import { updateFault } from "../services/faultService";
const DataTable = ({ data, onDoneClick }) => {
  const { user } = useUser(); // Get user from context
  const handleDoneClick = async (row, userId) => {
    await updateFault(row.id, { done: true, fixed_id: userId });
    // Refresh data or update state as needed
    window.location.reload();
  };
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>בוצע?</th>
          <th>מיקום</th>
          <th>תאריך</th>
          <th>שעה</th>
          <th>פקיד</th>
          <th>תיאור תקלה</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
            <td>
              {row.done ? "✔" : (
                user?.classification === 1 ? (
                  <button className="search-button" onClick={() => handleDoneClick(row, user?.uid)}>
                    סמן בוצע
                  </button>
                ) : ""
              )}
            </td>
            <td>{`${row.location} ${row.room_number}`}</td>
            <td>{row.date}</td>
            <td>{row.time}</td>
            <td>{row.command}</td>
            <td>{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;