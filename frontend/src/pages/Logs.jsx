import React, { useState, useEffect } from "react";
import api from "../api";
import LogsComponent from "../components/LogsComponent";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import LoadingCircle from "../components/LoadingCircle";
import Search from "../components/Search";

function Logs() {
  const [allLogs, setAllLogs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
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
    getLogs();
  }, []);

  const getLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/log/data/");
      const fullLogs = response.data;
      setAllLogs(fullLogs);

      const recentLogs = fullLogs.filter((log) => {
        if (!log.date) return false;
        const logDate = new Date(log.date);
        return logDate >= thirtyDaysAgo && logDate <= now;
      });

      recentLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setLogs(recentLogs);
      setFilteredLogs(recentLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = allLogs;

    // Filter by date range if specified
    if (startDate || endDate) {
      filtered = filtered.filter((log) => {
        if (!log.date) return false;
        const logDate = new Date(log.date);
        let valid = true;
        if (startDate) {
          valid = valid && logDate >= new Date(startDate);
        }
        if (endDate) {
          valid = valid && logDate <= new Date(endDate);
        }
        return valid;
      });
    } else {
      filtered = logs;
    }

    // Filter by search term with multiple date formats
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((log) => {
        const logID = log.logID.toString().toLowerCase();
        const employeeID = log.employeeID.toString().toLowerCase();
        const truckID = log.truckID.toString().toLowerCase();
        const trailerID = log.trailerID ? log.trailerID.toString().toLowerCase() : "";
        const location = log.location ? log.location.toLowerCase() : "";
        const city = log.city ? log.city.toLowerCase() : "";
        let dateMatch = false;
        if (log.date) {
          const date = new Date(log.date);
          const dateFormats = [
            date.toLocaleDateString("en-US"),
            date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            date.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
            date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          ].map((format) => format.toLowerCase());
          dateMatch = dateFormats.some((format) => format.includes(lowerSearchTerm));
        }
        const tripText = log.trip === 1 ? "post" : "pre";
        return (
          logID.includes(lowerSearchTerm) ||
          employeeID.includes(lowerSearchTerm) ||
          truckID.includes(lowerSearchTerm) ||
          trailerID.includes(lowerSearchTerm) ||
          location.includes(lowerSearchTerm) ||
          city.includes(lowerSearchTerm) ||
          dateMatch ||
          tripText.includes(lowerSearchTerm)
        );
      });
    }
    setFilteredLogs(filtered);
  };

  const reset = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setFilteredLogs(logs);
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
          onSearch={filterLogs}
          onReset={reset}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        {/* Display default date range if no filters applied */}
        { !searchTerm && !startDate && !endDate && (
          <div className="ml-4 text-sm text-gray-500">
            Showing logs from {thirtyDaysAgo.toLocaleDateString()} to {now.toLocaleDateString()}
          </div>
        )}
        <div className="mx-auto border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="w-full">
            <table className="w-full border-collapse">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3 border border-gray-700 w-24">Log ID</th>
                  <th className="p-3 border border-gray-700 w-32">Employee ID</th>
                  <th className="p-3 border border-gray-700 w-32">Truck ID</th>
                  <th className="p-3 border border-gray-700 w-32">Trailer ID</th>
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
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <LogsComponent log={log} key={log.logID} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No logs found.
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

export default Logs;
