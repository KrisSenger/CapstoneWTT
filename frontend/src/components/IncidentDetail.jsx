import React, { useState, useEffect } from "react";
import api from "../api";
import FormatDate from "./FormatDate";
import LoadingCircle from "./LoadingCircle";
import Popup from "./Popup";

function IncidentDetail({ id }) {
  const [incident, setIncident] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    console.info("Fetching incident details for incident ID:", id);
    api
      .get(`/api/incident/${id}/`)
      .then((response) => setIncident(response.data))
      .catch((error) =>
        console.error("Error fetching incident details:", error)
      );
  }, [id]);

  if (!incident) return <LoadingCircle />;

  const employeeID = incident.employeeID;
  const truckID = incident.truckID;
  const trailerID = incident.trailerID;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4 uppercase">
        Incident Detail
      </h1>
      <div className="flex justify-between flex-wrap border-b pb-3 mb-4">
        <div className="mb-2">
          <p>
            <strong>INCIDENT ID:</strong> {incident.incidentID}
          </p>
          <p>
            <strong>EMPLOYEE ID:</strong> {employeeID}
          </p>
          <p>
            <strong>TRUCK ID:</strong> {truckID}
          </p>
          <p>
            <strong>TRAILER ID:</strong> {trailerID}
          </p>
        </div>
        <div className="mb-2">
          <p>
            <strong>DATE:</strong> {FormatDate(incident.date)}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p className="border p-2 min-h-[80px]">{incident.summary}</p>
      </div>
     {/* Pictures Section */}
     <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Pictures</h2>
        {incident.pictures && incident.pictures.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {incident.pictures.map((pic) => (
              <img
                key={pic.srsincpicID}
                src={pic.picture}
                alt={`Incident Picture ${pic.srsincpicID}`}
                className="max-w-xs rounded shadow cursor-pointer"
                onClick={() => setFullScreenImage(pic.picture)}
              />
            ))}
          </div>
        ) : (
          <p>No pictures available.</p>
        )}
      </div>

      {/* Full Screen Image Popup */}
      {fullScreenImage && (
        <Popup onClose={() => setFullScreenImage(null)}>
          <img
            src={fullScreenImage}
            alt="Full Screen"
            className="w-full h-full object-contain"
          />
        </Popup>
      )}
    </div>
  );
}

export default IncidentDetail;