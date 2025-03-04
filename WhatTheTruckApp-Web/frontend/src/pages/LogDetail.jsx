import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import GoBack from "../components/GoBack";
import FormatDate from "../components/FormatDate";

function LogDetail() {
  const { id } = useParams();
  const [log, setLog] = useState(null);

  useEffect(() => {
    api.get(`/api/log/${id}/`)
      .then((response) => setLog(response.data))
      .catch((error) => console.error("Error fetching log details:", error));
  }, [id]);

  if (!log) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <GoBack />
      <h1 className="text-2xl mb-4">Log Detail for ID: {log.logID}</h1>
      <div>
        <p><strong>Employee ID:</strong> {log.employeeID}</p>
        <p><strong>Truck ID:</strong> {log.truckID}</p>
        <p><strong>Trailer ID:</strong> {log.trailerID}</p>
        <p><strong>Trip:</strong> {log.trip === 1 ? "Post trip" : "Pre trip"}</p>
        <p><strong>Location:</strong> {log.location}</p>
        <p><strong>City:</strong> {log.city}</p>
        <p><strong>Date:</strong> {FormatDate(log.date)}</p>
        <p><strong>Load:</strong> {log.load}</p>
        <p><strong>Height:</strong> {log.height}</p>
        <p><strong>Defects en route:</strong> {log.defects_en_route}</p>
        <p><strong>Incidents:</strong> {log.incidents}</p>
        <p><strong>Remarks:</strong> {log.remarks}</p>
        <p><strong>Pictures:</strong> {log.pictures}</p>
        <p>
          <strong>Declaration:</strong> 
          <span className={log.declaration === 0 ? "text-red-500" : ""}>
            {log.declaration === 1 ? " yes" : " no"}
          </span>
        </p>
        <p><strong>Signature:</strong> {log.signature}</p>
      </div>

      <h2 className="text-xl mt-8 mb-4">Defective Items</h2>
      {log.defective_items && log.defective_items.length > 0 ? (
        <ul className="list-disc ml-6">
          {log.defective_items.map((item) => (
            <li key={item.itemID}>{item.item_name}</li>
          ))}
        </ul>
      ) : (
        <p>No defective items found for this log.</p>
      )}
    </div>
  );
}

export default LogDetail;
