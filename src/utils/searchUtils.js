export function filterFaults(faults, text, category) {
  const search = text.trim().toLowerCase();
  let filtered = faults;

  if (search) {
    switch (category) {
      case "מיקום":
        filtered = faults.filter(fault =>
          (`${fault.location || ""} ${fault.room_number || ""}`.toLowerCase().includes(search))
        );
        break;
      case "שעה":
        filtered = faults.filter(fault =>
          (fault.time || "").toLowerCase().includes(search)
        );
        break;
      case "פקיד":
        filtered = faults.filter(fault =>
          (fault.command || "").toLowerCase().includes(search)
        );
        break;
      case "לפי קטגוריה":
      default:
        filtered = faults.filter(fault =>
          (fault.description || "").toLowerCase().includes(search) ||
          (`${fault.location || ""} ${fault.room_number || ""}`.toLowerCase().includes(search)) ||
          (fault.time || "").toLowerCase().includes(search) ||
          (fault.command || "").toLowerCase().includes(search)
        );
        break;
    }
  }

  return filtered;
}