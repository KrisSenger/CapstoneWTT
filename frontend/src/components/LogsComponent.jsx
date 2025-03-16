import React from "react";
import ReactDOM from "react-dom";
import { useState } from 'react';
import FormatDate from "../components/FormatDate";
import Popup from "./Popup";
import LogDetail from "./LogDetail";

export default function LogsComponent({ log }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <tr
        key={log.logID}
        className="cursor-pointer hover:bg-gray-100"
        onClick={() => setShowPopup(true)}
      >
        <td>{log.logID}</td>
        <td>{log.employeeID}</td>
        <td>{log.truckID}</td>
        <td>{log.trailerID}</td>
        <td>{log.trip === 1 ? "Post trip" : "Pre trip"}</td>
        <td>{log.location}</td>
        <td>{log.city}</td>
        <td>{FormatDate(log.date)}</td>
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

      </tr>

      {showPopup && (
        ReactDOM.createPortal(
          <Popup
            title={log.logID}
            onClose={() => setShowPopup(false)}
          >
            <LogDetail id={log.logID} />
          </Popup>,
          document.body)
      )}
    </>

  );
}
