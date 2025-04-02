import React from 'react';

export default function LoadingCircle() {
    return (
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
        </div>
    );

}