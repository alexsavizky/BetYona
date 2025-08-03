import React, { useState, useEffect } from "react";
import { fetchFaults } from "../services/faultService";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import "../styles/AllFaults.css";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { filterFaults } from "../utils/searchUtils";
const DoneFaults = () => {
  const items_for_page = 10;
  const [faults, setFaults] = useState([]);
  const [filteredFaults, setFilteredFaults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaults = async () => {
      try {
        const faultData = await fetchFaults();
        const doneFaults = faultData.filter(fault => fault.done === "✔️");
        setFaults(doneFaults);
        setFilteredFaults(doneFaults);
      } catch (error) {
        console.error("Error fetching faults:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFaults();
  }, []);

  const handleSearch = (text, category) => {
  setFilteredFaults(filterFaults(faults, text, category));
};

  const totalPages = Math.ceil(filteredFaults.length / items_for_page);

  return (
    <div className="app-container">
      <Header />
      <div className="no-header">
        <Navigation />
        <div className="content">
          <div className="all-faults-container">
            <SearchBar onSearch={handleSearch} />
            {loading ? (
              <p>טוען נתונים...</p>
            ) : (
              <>
                <DataTable
                  data={filteredFaults.slice(
                    (currentPage - 1) * items_for_page,
                    currentPage * items_for_page
                  )}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoneFaults;