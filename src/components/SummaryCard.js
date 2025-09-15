import React from "react";

const SummaryCard = ({ title, value }) => {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      margin: "10px",
      width: "150px"
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>{value}</p>
    </div>
  );
};

export default SummaryCard;