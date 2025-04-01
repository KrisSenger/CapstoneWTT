import React, { useState } from "react";
import ReactDOM from "react-dom";
import FormatDate from "../components/FormatDate";
import Popup from "./Popup";
import IncidentDetail from "./IncidentDetail";

export default function IncidentsComponent({ incident }) {
  const [showPopup, setShowPopup] = useState(false);

  const employeeID = incident.employeeID;
  const truckID = incident.truckID;
  const trailerID = incident.trailerID;

  return (
    <>
      <tr
        key={incident.incidentID}
        className="cursor-pointer hover:bg-gray-100 even:bg-gray-50 transition duration-200 w-full"
        onClick={() => setShowPopup(true)}
      >
        <td className="p-3 border border-gray-300 w-24">
          {incident.incidentID}
        </td>
        <td className="p-3 border border-gray-300 w-32">
          {employeeID}
        </td>
        <td className="p-3 border border-gray-300 w-32">
          {truckID}
        </td>
        <td className="p-3 border border-gray-300 w-32">
          {trailerID}
        </td>
        <td className="p-3 border border-gray-300 w-40">
          {FormatDate(incident.date)}
        </td>
        <td className="p-3 border border-gray-300 w-40">
          {incident.summary
            ? incident.summary.substring(0, 50) +
              (incident.summary.length > 50 ? "..." : "")
            : ""}
        </td>
      </tr>
      {showPopup &&
        ReactDOM.createPortal(
          <Popup
            title={incident.incidentID}
            onClose={() => setShowPopup(false)}
          >
            <IncidentDetail id={incident.incidentID} />
          </Popup>,
          document.body
        )}
    </>
  );
}
