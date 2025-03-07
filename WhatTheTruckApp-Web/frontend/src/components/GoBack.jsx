import React from "react";
import { useNavigate } from "react-router-dom";

const GoBack = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-1
        text-orange-500 
        font-bold
        hover:font-extrabold"
    >
      {/* &larr;  */}
      &lt; Go Back
    </button>
  );
};

export default GoBack;
