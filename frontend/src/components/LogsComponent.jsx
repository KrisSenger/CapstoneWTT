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
        className="cursor-pointer hover:bg-gray-100 even:bg-gray-50 transition duration-200 w-full"
        onClick={() => setShowPopup(true)}
      >
        <td className="p-3 border border-gray-300 w-24">{log.logID}</td>
        <td className="p-3 border border-gray-300 w-32">{log.employeeID}</td>
        <td className="p-3 border border-gray-300 w-32">{log.truckID}</td>
        <td className="p-3 border border-gray-300 w-32">{log.trailerID}</td>
        <td className="p-3 border border-gray-300 w-40">{FormatDate(log.date)}</td>
        <td className="p-3 border border-gray-300 w-32">
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${log.declaration === 1 ? "bg-green-500" : "bg-red-500"
              }`}
          >
            {log.declaration === 1 ? "No issues!" : "Too many issues!"}
          </span>
        </td>
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
