import { useState, useEffect, use } from "react";
import api from "../api";
import LogsComponent from "../components/LogsComponent";
import ReturnHome from "../components/ReturnHome";
import Header from "../components/Header";

function Incidents() {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        getLogs();

    }, []);
    useEffect(() => {
        console.log(logs);
    }, []);
    const getLogs = () => {
        api.get("/api/log/data/")
            .then((response) => response.data)
            .then((data) => setLogs(data))
            .catch((error) => console.error("Error fetching logs:", error));

    }
    return (
        <div>
            <ReturnHome />
            <br />
            <Header />
            <h1>Incidents</h1>
            <table>
                <thead>
                    <tr>
                        <th>Log ID</th>
                        <th>Employee ID</th>
                        <th>Truck ID</th>
                        <th>Trailer ID</th>
                        <th>Trip</th>
                        <th>Location</th>
                        <th>City</th>
                        <th>Date</th>
                        <th>Load</th>
                        <th>Height</th>
                        <th>Defects en route</th>
                        <th>Incidents</th>
                        <th>Remarks</th>
                        <th>Pictures</th>
                        <th>Declaration</th>
                        <th>Signature</th>
                    </tr>
                </thead>
                <tbody>
                    {logs
                        .filter((log) => log.declaration === 0 || log.defects_en_route?.trim() !== "" || log.incidents?.trim() !== "" || log.remarks?.trim() !== "")
                        .map((log) => (
                            <LogsComponent log={log} key={log.logID} />
                        ))}
                </tbody>
            </table>
        </div>
    );
}
export default Incidents;