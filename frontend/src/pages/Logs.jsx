import { useState, useEffect } from "react";
import api from "../api";
import LogsComponent from "../components/LogsComponent";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LoadingCircle from "../components/LoadingCircle";

function Logs() {
  const [allLogs, setAllLogs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  console.log("Thirty days ago:", thirtyDaysAgo);

  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/log/data/");
      const fullLogs = response.data;
      setAllLogs(fullLogs);

      const recentLogs = fullLogs.filter(log => {
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
    if (!searchTerm) {
      // When no search term, show default (last 30 days) logs
      setFilteredLogs(logs);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();

    const filtered = allLogs.filter((log) => {
      const logID = log.logID.toString().toLowerCase();
      const employeeID = log.employeeID.toString().toLowerCase();
      const truckID = log.truckID.toString().toLowerCase();
      const trailerID = log.trailerID ? log.trailerID.toString().toLowerCase() : "";
      const location = log.location ? log.location.toLowerCase() : "";
      const city = log.city ? log.city.toLowerCase() : "";

      // date formats
      let dateMatch = false;
      if (log.date) {
        const date = new Date(log.date);
        const dateFormats = [
          date.toLocaleDateString('en-US'), // like "2/10/2025"
          date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }), // like "02/10/2025"
          date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), // like "February 10, 2025"
          date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }), // like "February 10"
          date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) // like "February 2025"
        ].map(s => s.toLowerCase());
        dateMatch = dateFormats.some(format => format.includes(lowerSearchTerm));
      }

      // 1 means "post", any other value means "pre"
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
    
    setFilteredLogs(filtered);
  };

  const reset = () => {
    setSearchTerm("");
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
        <div className="p-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full max-w-xs"
          />
          <button
            onClick={reset}
            className="p-2 mt-2 bg-blue-500 text-white rounded-md w-full max-w-xs"
          >
            Reset
          </button>
          <button
            onClick={filterLogs}
            className="p-2 mt-2 bg-blue-500 text-white rounded-md w-full max-w-xs"
          >
            Search
          </button>

          {!searchTerm && (
            <span className="ml-2 text-sm text-gray-500">
              Showing logs from {thirtyDaysAgo.toLocaleDateString()} to {now.toLocaleDateString()}
            </span>
          )}

        </div>
        <div className="mx-auto border border-gray-300 shadow-lg rounded-lg overflow-hidden">
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
                  filteredLogs.map((log) => <LogsComponent log={log} key={log.logID} />)
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
