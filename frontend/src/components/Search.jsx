import React from "react";

const Search = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  onReset,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-full max-w-xs"
      />
      {/* Date range fields if provided */}
      {startDate !== undefined && setStartDate !== undefined && (
        <div className="mt-2 flex flex-col">
          <label className="text-sm text-gray-500">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full max-w-xs"
          />
          <label className="text-sm text-gray-500 mt-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full max-w-xs"
          />
        </div>
      )}
      <button
        onClick={onReset}
        className="p-2 mt-2 mr-2 bg-blue-500 text-white rounded-md w-full max-w-xs"
      >
        Reset
      </button>
      <button
        onClick={onSearch}
        className="p-2 mt-2 ml-2 bg-blue-500 text-white rounded-md w-full max-w-xs"
      >
        Search
      </button>
    </div>
  );
};

export default Search;
