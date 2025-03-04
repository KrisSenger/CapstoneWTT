import React from "react";
import { useNavigate } from "react-router-dom";

const GoBack = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-4 
        text-orange-500 
        hover:font-bold"
    >
      &larr; Go Back
    </button>
  );
};

export default GoBack;
