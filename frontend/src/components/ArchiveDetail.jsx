import React, { useState, useEffect } from "react";
import api from "../api";
import FormatDate from "./FormatDate";
import LoadingCircle from "./LoadingCircle";
import Popup from "./Popup";

function ArchiveDetail({ id }) {
  const [archive, setArchive] = useState(null);
  const [items, setItems] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    console.info("Fetching archive details for archive ID:", id);
    api
      .get(`/api/archive/${id}/`)
      .then((response) => {
        setArchive(response.data);
        // Fetch inspection items
        return api.get(`/api/archive/${id}/items/`);
      })
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => console.error("Error fetching archive details:", error));
  }, [id]);

  if (!archive || !items) return <LoadingCircle />;

  // Destructure inspection items
  const {
    truck_items_group1 = [],
    truck_items_group2 = [],
    truck_items_group3 = [],
    trailer_items = [],
  } = items;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4 uppercase">
        Archived Vehicle Inspection Report
      </h1>

      {/* Basic Archive Info */}
      <div className="flex justify-between flex-wrap border-b pb-3 mb-4">
        <div className="mb-2">
          <p>
            <strong>ARCHIVE ID:</strong> {archive.archiveID}
          </p>
          <p>
            <strong>TRIP:</strong> {archive.trip === 1 ? "Post Trip" : "Pre Trip"}
          </p>
          <p>
            <strong>LOCATION:</strong> {archive.location}
          </p>
          <p>
            <strong>CITY:</strong> {archive.city}
          </p>
        </div>
        <div className="mb-2">
          <p>
            <strong>DATE:</strong> {FormatDate(archive.date)}
          </p>
          <p>
            <strong>LOAD:</strong> {archive.load}
          </p>
          <p>
            <strong>HEIGHT:</strong> {archive.height}
          </p>
          <p>
            <strong>DECLARATION:</strong>{" "}
            <span className={archive.declaration === 0 ? "text-red-500" : ""}>
              {archive.declaration === 1 ? "Yes" : "No"}
            </span>
          </p>
        </div>
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
                  checked={item.checked}
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
                  checked={item.checked}
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
                  checked={item.checked}
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
                  checked={item.checked}
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
          <strong>Defects en route:</strong> {archive.defects_en_route || "None"}
        </p>
        <h2 className="text-xl font-semibold mb-2">Remarks</h2>
        <p className="border p-2 min-h-[80px]">{archive.remarks || "None"}</p>
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

export default ArchiveDetail; 