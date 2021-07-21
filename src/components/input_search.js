import React from "react";

const InputSearch = ({ column }) => {
  const { filterValue, setFilter } = column;
  return (
    <span>
      <input
        type="text"
        className="form-control"
        value={filterValue || ""}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Pencarian Data...."
      />
    </span>
  );
};

export default InputSearch;
