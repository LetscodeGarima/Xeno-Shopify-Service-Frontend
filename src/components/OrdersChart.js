import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const OrdersChart = ({ data }) => {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="orders_count" stroke="#8884d8" name="Orders" />
      <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
    </LineChart>
  );
};

export default OrdersChart;