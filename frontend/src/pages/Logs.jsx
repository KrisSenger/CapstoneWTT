import { useState, useEffect } from "react";
import api from "../api";
import LogsComponent from "../components/LogsComponent";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LoadingCircle from "../components/LoadingCircle";

function Logs() {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    //const [searchType, setSearchType] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    useEffect(() => {
        getLogs();

    }, []);
    const getLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/log/data/");
            setLogs(response.data);
            setFilteredLogs(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };
    const filterLogs = () => {
        if (searchTerm === "") {
            setFilteredLogs(logs);
        } else {
            const filtered = logs.filter((log) => {
                return log.logID.toString().includes(searchTerm.toLowerCase());
            });
            setFilteredLogs(filtered);

        }
    }


    const reset = () => {
        setSearchTerm("");
        setFilteredLogs(logs);
    }
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            <Header darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                toggleSidebar={toggleSidebar} />
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
                        onClick={() => reset()}
                        className="p-2 mt-2 bg-blue-500 text-white rounded-md w-full max-w-xs"
                    >reset</button>
                    <button
                        onClick={filterLogs}
                        className="p-2 mt-2 bg-blue-500 text-white rounded-md w-full max-w-xs"
                    >Search</button>
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