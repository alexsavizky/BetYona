import React from "react";
import "../styles/DataTable.css";

const DataTable = ({ data }) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>בוצע?</th>
          <th>מיקום</th>
          <th>תאריך</th>
          <th>שעה</th>
          <th>פיקוד</th>
          <th>תיאור תקלה</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
            <td>{row.done ? "✔" : ""}</td>
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
