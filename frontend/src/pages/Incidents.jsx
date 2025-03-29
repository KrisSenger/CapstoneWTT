import React, { useState, useEffect } from "react";
import api from "../api";
import IncidentsComponent from "../components/IncidentsComponent";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import LoadingCircle from "../components/LoadingCircle";
import Search from "../components/Search";

function Incidents() {
  const [allIncidents, setAllIncidents] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
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
    getIncidents();
  }, []);

  const getIncidents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/incident/data/");
      const fullIncidents = response.data;
      setAllIncidents(fullIncidents);

      const recentIncidents = fullIncidents.filter((incident) => {
        if (!incident.date) return false;
        const incidentDate = new Date(incident.date);
        return incidentDate >= thirtyDaysAgo && incidentDate <= now;
      });

      recentIncidents.sort((a, b) => new Date(b.date) - new Date(a.date));
      setIncidents(recentIncidents);
      setFilteredIncidents(recentIncidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterIncidents = () => {
    let filtered = allIncidents;

    // Filter by selected date range if specified
    if (startDate || endDate) {
      filtered = filtered.filter((incident) => {
        if (!incident.date) return false;
        const incidentDate = new Date(incident.date);
        let valid = true;
        if (startDate) {
          valid = valid && incidentDate >= new Date(startDate);
        }
        if (endDate) {
          valid = valid && incidentDate <= new Date(endDate);
        }
        return valid;
      });
    } else {
      filtered = incidents;
    }

    // Filter by search term with multiple date formats
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((incident) => {
        const incidentID = incident.incidentID.toString().toLowerCase();
        const employeeID = incident.employeeID
          ? incident.employeeID.toString().toLowerCase()
          : "";
        const truckID = incident.truckID
          ? incident.truckID.toString().toLowerCase()
          : "";
        const trailerID = incident.trailerID
          ? incident.trailerID.toString().toLowerCase()
          : "";
        const summary = incident.summary ? incident.summary.toLowerCase() : "";
        let dateMatch = false;
        if (incident.date) {
          const date = new Date(incident.date);
          const dateFormats = [
            date.toLocaleDateString("en-US"),
            date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            date.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
            date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          ].map((format) => format.toLowerCase());
          dateMatch = dateFormats.some((format) => format.includes(lowerSearchTerm));
        }
        return (
          incidentID.includes(lowerSearchTerm) ||
          employeeID.includes(lowerSearchTerm) ||
          truckID.includes(lowerSearchTerm) ||
          trailerID.includes(lowerSearchTerm) ||
          summary.includes(lowerSearchTerm) ||
          dateMatch
        );
      });
    }
    setFilteredIncidents(filtered);
  };

  const reset = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setFilteredIncidents(incidents);
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
          onSearch={filterIncidents}
          onReset={reset}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        {/* Display default date range if no filters applied */}
        { !searchTerm && !startDate && !endDate && (
          <div className="ml-4 text-sm text-gray-500">
            Showing incidents from {thirtyDaysAgo.toLocaleDateString()} to {now.toLocaleDateString()}
          </div>
        )}
        <div className="mx-auto border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="w-full">
            <table className="w-full border-collapse">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3 border border-gray-700 w-24">Incident ID</th>
                  <th className="p-3 border border-gray-700 w-32">Employee ID</th>
                  <th className="p-3 border border-gray-700 w-32">Truck ID</th>
                  <th className="p-3 border border-gray-700 w-32">Trailer ID</th>
                  <th className="p-3 border border-gray-700 w-40">Date</th>
                  <th className="p-3 border border-gray-700 w-40">Summary</th>
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
                ) : filteredIncidents.length > 0 ? (
                  filteredIncidents.map((incident) => (
                    <IncidentsComponent incident={incident} key={incident.incidentID} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No incidents found.
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

export default Incidents;
