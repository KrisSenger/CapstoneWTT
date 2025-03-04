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
            <td>{log.load}</td>
            <td>{log.height}</td>
            <td>{log.defects_en_route}</td>
            <td>{log.incidents}</td>
            <td>{log.remarks}</td>
            <td>{log.pictures}</td>
            <td>{log.declaration}</td>
            <td>{log.signature}</td>
        </tr>
    );



}