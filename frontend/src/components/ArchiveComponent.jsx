import React from "react";
import ReactDOM from "react-dom";
import { useState } from 'react';
import Popup from "./Popup";
import ArchiveDetail from "./ArchiveDetail";

export default function ArchiveComponent({ archive }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <tr
        key={archive.archiveID}
        className="cursor-pointer hover:bg-gray-100 even:bg-gray-50 transition duration-200 w-full"
        onClick={() => setShowPopup(true)}
      >
        <td className="p-3 border border-gray-300 w-24">{archive.archiveID}</td>
        <td className="p-3 border border-gray-300 w-32">{archive.trip === 1 ? "Post Trip" : "Pre Trip"}</td>
        <td className="p-3 border border-gray-300 w-32">{archive.location}</td>
        <td className="p-3 border border-gray-300 w-32">{archive.city}</td>
        <td className="p-3 border border-gray-300 w-40">{archive.date}</td>
        <td className="p-3 border border-gray-300 w-32">
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${archive.declaration === 1 ? "bg-green-500" : "bg-red-500"}`}
          >
            {archive.declaration === 1 ? "No issues!" : "Issues found!"}
          </span>
        </td>
      </tr>

      {showPopup && (
        ReactDOM.createPortal(
          <Popup
            title={`Archive ${archive.archiveID}`}
            onClose={() => setShowPopup(false)}
          >
            <ArchiveDetail id={archive.archiveID} />
          </Popup>,
          document.body)
      )}
    </>
  );
} 