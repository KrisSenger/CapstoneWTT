import React, { useState, useEffect } from "react";
import api from "../api";
import ArchiveComponent from "../components/ArchiveComponent";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import LoadingCircle from "../components/LoadingCircle";
import Search from "../components/Search";

function Archive() {
  const [allArchives, setAllArchives] = useState([]);
  const [archives, setArchives] = useState([]);
  const [filteredArchives, setFilteredArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  useEffect(() => {
    getArchives();
  }, []);

  const getArchives = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/archive/data/");
      const fullArchives = response.data;
      setAllArchives(fullArchives);

      // Sort archives by archiveID in descending order
      const sortedArchives = [...fullArchives].sort((a, b) => b.archiveID - a.archiveID).slice(0, 30);

      setArchives(sortedArchives);
      setFilteredArchives(sortedArchives);
    } catch (error) {
      console.error("Error fetching archives:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterArchives = () => {
    // If no search term and no date filter, use 30 days of recent archives
    if (!searchTerm && !startDate && !endDate) {
      setFilteredArchives(archives);
      return;
    }
  
    // Start with the full archives
    let filtered = allArchives;
  
    // Apply date filter
    if (startDate || endDate) {
      filtered = filtered.filter((archive) => {
        if (!archive.date) return false;
        const archiveDate = new Date(archive.date);
        let valid = true;
        if (startDate) {
          valid = valid && archiveDate >= new Date(startDate);
        }
        if (endDate) {
          valid = valid && archiveDate <= new Date(endDate);
        }
        return valid;
      });
    }
  
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((archive) => {
        const archiveID = archive.archiveID.toString().toLowerCase();
        const location = archive.location ? archive.location.toLowerCase() : "";
        const city = archive.city ? archive.city.toLowerCase() : "";
        let dateMatch = false;
        if (archive.date) {
          const date = new Date(archive.date);
          const dateFormats = [
            date.toLocaleDateString("en-US"),
            date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            date.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
            date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          ].map((format) => format.toLowerCase());
          dateMatch = dateFormats.some((format) => format.includes(lowerSearchTerm));
        }
        const tripText = archive.trip === 1 ? "post" : "pre";
        return (
          archiveID.includes(lowerSearchTerm) ||
          location.includes(lowerSearchTerm) ||
          city.includes(lowerSearchTerm) ||
          dateMatch ||
          tripText.includes(lowerSearchTerm)
        );
      });
    }
    setFilteredArchives(filtered);
  };

  const reset = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setFilteredArchives(archives);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen}>
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={filterArchives}
          onReset={reset}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <div className="mx-auto border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="w-full">
            <table className="w-full border-collapse">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3 border border-gray-700 w-24">Archive ID</th>
                  <th className="p-3 border border-gray-700 w-32">Trip Type</th>
                  <th className="p-3 border border-gray-700 w-32">Location</th>
                  <th className="p-3 border border-gray-700 w-32">City</th>
                  <th className="p-3 border border-gray-700 w-40">Date</th>
                  <th className="p-3 border border-gray-700 w-32">Issues Declared</th>
                </tr>
              </thead>
            </table>
          </div>
          {/* Table body */}
          <div className="overflow-y-auto max-h-[80vh]">
            <table className="w-full border-collapse">
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center p-6">
                      <LoadingCircle />
                    </td>
                  </tr>
                ) : filteredArchives.length > 0 ? (
                  filteredArchives.map((archive) => (
                    <ArchiveComponent archive={archive} key={archive.archiveID} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No archives found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}

export default Archive;
