import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  orderBy,doc, updateDoc
} from "firebase/firestore";

export const fetchFaults = async () => {
  try {
    const faultCollection = collection(db, "fault");
    const faultsQuery = query(faultCollection, orderBy("date_time", "desc"));
    const faultSnapshot = await getDocs(faultsQuery);

    const faultsArray = faultSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    const ownerUids = [
      ...new Set(faultsArray.map((fault) => fault.owner_uid).filter(Boolean)),
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
      let locationName =fault.location.toString();
      

      const dateTime = fault.date_time.toDate();
      const date = dateTime.toLocaleDateString("he-IL");
      const time = dateTime.toLocaleTimeString("he-IL",{
  hour: "2-digit",
  minute: "2-digit",});

      const userName = userMap[fault.owner_uid] || "לא ידוע";
      const isFixed = fault.fixed_id ? "✔️" : "";

      return {
        id: fault.id,
        done: isFixed,
        location: locationName,
        room_number: fault.room_number,
        date: date,
        time: time,
        command: userName,
        description: fault.description || "",
      };
    });

    return faultData;
  } catch (error) {
    console.error("Error fetching faults:", error);
    throw error;
  }
};

export const addFault = async (fault) => {
  try {
    const faultCollection = collection(db, "fault");
    const docRef = await addDoc(faultCollection, {
      location: fault.location,
      room_number: fault.roomNumber,
      description: fault.description,
      date_time: new Date(),
      owner_uid: fault.ownerUid, // If applicable
      fixed_id: null, // Initially, not fixed
    });

    return docRef.id; // Returns the new document ID
  } catch (error) {
    console.error("Error adding fault:", error);
    throw error;
  }
};
export const updateFault = async (id, data) => {
  const faultRef = doc(db, "fault", id);
  await updateDoc(faultRef, data);
};