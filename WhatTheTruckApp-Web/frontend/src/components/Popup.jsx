import React from "react";

export default function Popup({ children, onClose }) {
    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white p-4 max-w-7xl w-full max-h-[140vh] overflow-y-auto rounded-lg shadow-lg">
                <div className="flex justify-end">
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-300 " onClick={() => { console.log("clicked"); onClose(); }}>
                        Close
                    </button>
                </div>
                <div className="max-h-[90vh] overflow-y-auto scrollbar-auto">
                    {children}
                </div>


            </div>
        </div>
    );
}