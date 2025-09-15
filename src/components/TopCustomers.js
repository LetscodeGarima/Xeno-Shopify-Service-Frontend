import React from "react";

const TopCustomers = ({ data }) => {
  return (
    <div>
      <h3>Top 5 Customers by Spend</h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Total Spent</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {c.first_name} {c.last_name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{c.email}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>${c.total_spent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopCustomers;