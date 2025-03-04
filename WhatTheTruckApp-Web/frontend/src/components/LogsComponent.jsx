import React from "react";

export default function LogsComponent({ log }) {
    return (
        <tr key={log.logID}>
            <td>{log.employeeID}</td>
            <td>{log.truckID}</td>
            <td>{log.trailerID}</td>
            <td>{log.trip}</td>
            <td>{log.location}</td>
            <td>{log.city}</td>
            <td>{log.date}</td>
            <td>{log.load}</td>
            <td>{log.height}</td>
            <td>{log.defects_en_route}</td>
            <td>{log.incidents}</td>
            <td>{log.remarks}</td>
            <td>{log.pictures}</td>
            <td className={log.declaration === 0 ? "text-red-500" : ""}>
            {log.declaration === 1 ? "yes" : "no"}
            </td>
            <td>{log.signature}</td>
            <td>{log.signature}</td>
        </tr>
    );



}