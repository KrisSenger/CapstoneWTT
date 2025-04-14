import React, { useState, useEffect } from "react";
import api from "../api";
import FormatDate from "./FormatDate";
import LoadingCircle from "./LoadingCircle";
import Popup from "./Popup";

function LogDetail({ id }) {
  const [log, setLog] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    console.info("Fetching log details for log ID:", id);
    api
      .get(`/api/log/${id}/`)
      .then((response) => setLog(response.data))
      .catch((error) => console.error("Error fetching log details:", error));
  }, [id]);

  if (!log) return <LoadingCircle />;

  // Destructure inspection_items provided by the API
  const {
    truck_items_group1 = [],
    truck_items_group2 = [],
    truck_items_group3 = [],
    trailer_items = [],
  } = log.inspection_items || {};

  const anyDefects = log.any_defects;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md">

      <h1 className="text-2xl font-bold text-center mb-4 uppercase">
        Driver's Daily Vehicle Inspection Report
      </h1>

      {/* Basic Log Info */}
      <div className="flex justify-between flex-wrap border-b pb-3 mb-4">
        <div className="mb-2">
          <p>
            <strong>LOG ID:</strong> {log.logID}
          </p>
          <p>
            <strong>EMPLOYEE ID:</strong> {log.employeeID}
          </p>
          <p>
            <strong>TRUCK ID:</strong> {log.truckID}
          </p>
          <p>
            <strong>TRAILER ID:</strong> {log.trailerID}
          </p>
        </div>
        <div className="mb-2">
          <p>
            <strong>TRIP:</strong> {log.trip === 1 ? "Post Trip" : "Pre Trip"}
          </p>
          <p>
            <strong>DATE:</strong> {FormatDate(log.date)}
          </p>
          <p>
            <strong>LOCATION:</strong> {log.location}
          </p>
          <p>
            <strong>CITY:</strong> {log.city}
          </p>
          <p>
            <strong>TRUCK JURISDICTION:</strong> {log.truck_jurisdiction}
          </p>
          <p>
            <strong>TRAILER JURISDICTION:</strong> {log.trailer_jurisdiction}
          </p>
        </div>
      </div>

      {/* Additional Details */}
      <div className="flex justify-between flex-wrap mb-4">
        <div className="mb-2">
          <p>
            <strong>LOAD:</strong> {log.load}
          </p>
          <p>
            <strong>HEIGHT:</strong> {log.height}
          </p>
          <p>
            <strong>INCIDENTS:</strong> {log.incidents}
          </p>
        </div>
        <div className="mb-2">
          <p>
            <strong>Declaration:</strong>{" "}
            <span className={log.declaration === 0 ? "text-red-500" : ""}>
              {log.declaration === 1 ? "Yes" : "No"}
            </span>
          </p>
          <p>
            <strong>Driver Name:</strong> {log.driver_name}
          </p>
          <p>
            <strong>Signature:</strong> {log.signature}
          </p>
        </div>
      </div>

      {/* Defects Found / No Defects Found */}
      <div className="border-t border-b border-gray-300 py-2 mb-4 flex space-x-8">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="mr-2 accent-orange-500"
            checked={!anyDefects}
            readOnly
          />
          <span>No Defects Found</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="mr-2 accent-orange-500"
            checked={anyDefects}
            readOnly
          />
          <span>Defects Found</span>
        </label>
      </div>

      <h2 className="text-xl font-semibold mb-2">
        Check any defective item and give details under Remarks:
      </h2>
      {/* Checkbox section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-lg mb-2">Tractor / Truck</h3>
          <ul className="list-none space-y-1">
            {truck_items_group1.map((item) => (
              <li key={item.itemID} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 accent-orange-500"
                  checked={item.defective}
                  readOnly
                />
                <span className="text-sm">{item.item_name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Tractor / Truck</h3>
          <ul className="list-none space-y-1">
            {truck_items_group2.map((item) => (
              <li key={item.itemID} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 accent-orange-500"
                  checked={item.defective}
                  readOnly
                />
                <span className="text-sm">{item.item_name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Tractor / Truck</h3>
          <ul className="list-none space-y-1">
            {truck_items_group3.map((item) => (
              <li key={item.itemID} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 accent-orange-500"
                  checked={item.defective}
                  readOnly
                />
                <span className="text-sm">{item.item_name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Trailer</h3>
          <ul className="list-none space-y-1">
            {trailer_items.map((item) => (
              <li key={item.itemID} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 accent-orange-500"
                  checked={item.defective}
                  readOnly
                />
                <span className="text-sm">{item.item_name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Remarks Section */}
      <div className="mt-6">
        <p>
          <strong>Defects en route:</strong> {log.defects_en_route}
        </p>
        <h2 className="text-xl font-semibold mb-2">Remarks</h2>
        <p className="border p-2 min-h-[80px]">{log.remarks}</p>
      </div>

      {/* Pictures Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Pictures</h2>
        {log.pictures && log.pictures.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {log.pictures.map((pic) => (
              <img
                key={pic.logpicID}
                src={pic.picture}
                alt={`Log Picture ${pic.logpicID}`}
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

export default LogDetail;