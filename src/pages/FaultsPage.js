import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { useUser } from "../context/UserContext";
import UserInfoLogout from "../components/UserInfoLogout";
import "../styles/FaultList.css";

const FaultList = () => {
  const [faults, setFaults] = useState([]);
  const [filteredFaults, setFilteredFaults] = useState([]);
  const [includeOpen, setIncludeOpen] = useState(true);
  const [includeFixed, setIncludeFixed] = useState(true);
  const [searchRoom, setSearchRoom] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchOwner, setSearchOwner] = useState("");
  const { user } = useUser();

  useEffect(() => {
    const fetchFaults = async () => {
      try {
        const faultCollection = collection(db, "fault");
        const faultSnapshot = await getDocs(faultCollection);

        const faultsArray = faultSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const ownerUids = [
          ...new Set(
            faultsArray.map((fault) => fault.owner_uid).filter(Boolean)
          ),
        ];

        const userMap = {};
        const batchSize = 10;
        for (let i = 0; i < ownerUids.length; i += batchSize) {
          const batch = ownerUids.slice(i, i + batchSize);
          const usersQuery = query(
            collection(db, "users"),
            where("__name__", "in", batch)
          );
          const usersSnapshot = await getDocs(usersQuery);
          usersSnapshot.forEach((userDoc) => {
            userMap[userDoc.id] = userDoc.data().name || "לא ידוע";
          });
        }

        const faultData = faultsArray.map((fault) => {
          let locationName = "";
          switch (fault.location) {
            case 0:
              locationName = "חדר";
              break;
            case 1:
              locationName = "שלב א";
              break;
            case 2:
              locationName = "שלב ב";
              break;
            default:
              locationName = "לא ידוע";
          }

          const dateTime = fault.date_time.toDate();
          const date = dateTime.toLocaleDateString("he-IL");
          const time = dateTime.toLocaleTimeString("he-IL");

          const userName = userMap[fault.owner_uid] || "לא ידוע";
          const isFixed = fault.fixed_id ? "✔️" : "";

          return {
            id: fault.id,
            V: isFixed,
            location: locationName,
            room_number: fault.room_number,
            date: date,
            time: time,
            userName: userName,
            description: fault.description || "",
          };
        });

        setFaults(faultData);
        setFilteredFaults(faultData);
      } catch (error) {
        console.error("Error fetching faults:", error);
      }
    };

    fetchFaults();
  }, []);

  const applyFilters = () => {
    let filtered = faults;

    if (!includeOpen) {
      filtered = filtered.filter((fault) => fault.V);
    }

    if (!includeFixed) {
      filtered = filtered.filter((fault) => !fault.V);
    }

    if (searchRoom) {
      filtered = filtered.filter((fault) =>
        fault.room_number.toLowerCase().includes(searchRoom.toLowerCase())
      );
    }

    if (searchDate) {
      filtered = filtered.filter((fault) => fault.date.includes(searchDate));
    }

    if (searchOwner) {
      filtered = filtered.filter((fault) =>
        fault.userName.toLowerCase().includes(searchOwner.toLowerCase())
      );
    }

    setFilteredFaults(filtered);
  };

  const handleMarkAsFixed = async (faultId) => {
    try {
      const faultDocRef = doc(db, "fault", faultId);

      await updateDoc(faultDocRef, {
        fixed_id: user.uid,
      });

      setFaults((prev) =>
        prev.map((fault) =>
          fault.id === faultId
            ? { ...fault, V: "✔️", fixed_id: user.uid }
            : fault
        )
      );

      alert("התקלה דווחה כמתוקנת בהצלחה!");
    } catch (error) {
      console.error("Error updating document:", error);
      alert("שגיאה בדיווח התקלה");
    }
  };

  return (
    <div className="fault-list-container">
      <UserInfoLogout></UserInfoLogout>
      <h2 className="fault-list-header">רשימת תקלות</h2>

      {/* Filters */}
      <div className="filters">
        <label>
          <input
            type="checkbox"
            checked={includeOpen}
            onChange={(e) => setIncludeOpen(e.target.checked)}
          />
          תקלות פתוחות
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeFixed}
            onChange={(e) => setIncludeFixed(e.target.checked)}
          />
          תקלות שתופלו
        </label>
      </div>

      {/* Search Inputs */}
      <div className="search-fields">
        <input
          type="text"
          placeholder="חפש לפי מספר חדר"
          value={searchRoom}
          onChange={(e) => setSearchRoom(e.target.value)}
        />
        <input
          type="text"
          placeholder="חפש לפי תאריך"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="חפש לפי פקיד"
          value={searchOwner}
          onChange={(e) => setSearchOwner(e.target.value)}
        />
        <button onClick={applyFilters}>חפש</button>
      </div>

      {/* Fault Table */}
      {filteredFaults.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>V</th>
              <th>מיקום</th>
              <th>מיקום מדויק</th>
              <th>תאריך</th>
              <th>שעה</th>
              <th>פקיד</th>
              <th style={{ width: "40%" }}>מהות התקלה</th>
              {user?.classification === 1 && <th>פעולות</th>}
            </tr>
          </thead>
          <tbody>
            {filteredFaults.map((fault) => (
              <tr key={fault.id}>
                <td>{fault.V}</td>
                <td>{fault.location}</td>
                <td>{fault.room_number}</td>
                <td>{fault.date}</td>
                <td>{fault.time}</td>
                <td>{fault.userName}</td>
                <td>{fault.description}</td>
                {user?.classification === 1 && (
                  <td>
                    {!fault.V && (
                      <button onClick={() => handleMarkAsFixed(fault.id)}>
                        דווח שתוקן
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>אין תקלות להצגה</p>
      )}
    </div>
  );
};

export default FaultList;
