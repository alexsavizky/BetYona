import React, { useState } from "react";
import "../styles/DataTable.css";
import { useUser } from "../context/UserContext";
import { updateFault } from "../services/faultService";

const DataTable = ({ data }) => {
  const { user } = useUser();
  const [expandedRows, setExpandedRows] = useState([]);

  // Detect mobile view
  const isMobile = window.innerWidth <= 700;

  const handleDoneClick = async (row, userId) => {
    await updateFault(row.id, { done: true, fixed_id: userId });
    window.location.reload();
  };

  const toggleRow = (index) => {
    setExpandedRows((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th className="col-done">בוצע?</th>
          <th className="col-location">מיקום</th>
          <th className="col-desc">תיאור תקלה</th>
          {isMobile && <th></th>}
          {!isMobile && (
            <>
              <th className="col-date">תאריך</th>
              <th className="col-time">שעה</th>
              <th className="col-command">פקיד</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <React.Fragment key={index}>
            <tr className={index % 2 === 0 ? "even-row" : "odd-row"}>
              <td className="col-done">
                {row.done ? "✔" : (
                  user?.classification === 1 ? (
                    <button className="search-button" onClick={() => handleDoneClick(row, user?.uid)}>
                      סמן בוצע
                    </button>
                  ) : ""
                )}
              </td>
              <td className="col-location">{`${row.location} ${row.room_number}`}</td>
              <td className="col-desc">{row.description}</td>
              {isMobile && (
                <td>
                  <button
                    className="expand-btn"
                    onClick={() => toggleRow(index)}
                    aria-label={expandedRows.includes(index) ? "סגור מידע נוסף" : "הצג מידע נוסף"}
                  >
                    {expandedRows.includes(index) ? "▲" : "▼"}
                  </button>
                </td>
              )}
              {!isMobile && (
                <>
                  <td className="col-date">{row.date}</td>
                  <td className="col-time">{row.time}</td>
                  <td className="col-command">{row.command}</td>
                </>
              )}
            </tr>
            {/* Only on mobile: show expanded card */}
            {isMobile && expandedRows.includes(index) && (
              <tr>
                <td colSpan={4}>
                  <div className="mobile-extra-info">
                    <div><b>תיאור תקלה:</b> {row.description}</div>
                    <div><b>מיקום:</b> {row.location} {row.room_number}</div>
                    <div><b>בוצע:</b> {row.done ? "✔" : "לא"}</div>
                    <div><b>תאריך:</b> {row.date}</div>
                    <div><b>שעה:</b> {row.time}</div>
                    <div><b>פקיד:</b> {row.command}</div>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;