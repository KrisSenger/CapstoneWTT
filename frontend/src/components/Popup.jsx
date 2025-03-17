import React from "react";

export default function Popup({ children, onClose }) {
    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="relative bg-white p-4 max-w-7xl w-full max-h-[140vh] overflow-y-auto rounded-lg shadow-lg" >
                <div className="max-h-[90vh] overflow-y-auto scrollbar-auto relative p-4">
                    <div className="sticky top-0 flex justify-end p-2">
                        <button
                            className="bg-red-500 text-white hover:text-black border-red-600 border-solid border-1 px-4 py-2 rounded hover:bg-red-300 shadow-lg"
                            onClick={() => {
                                console.log("clicked");
                                onClose();
                            }}
                        >
                            Close
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}