import axios from "axios";

const BASE_URL = "https://xeno-shopify-service-backend.onrender.com"; // Backend endpoint

// Fetch total customers
export const getTotalCustomers = async () => {
  const response = await axios.get(`${BASE_URL}/total-customers`);
  return response.data.total_customers;
};

// Fetch total orders
export const getTotalOrders = async () => {
  const response = await axios.get(`${BASE_URL}/total-orders`);
  return response.data.total_orders;
};

// Fetch total revenue
export const getTotalRevenue = async () => {
  const response = await axios.get(`${BASE_URL}/total-revenue`);
  return response.data.total_revenue;
};

// Fetch top customers
export const getTopCustomers = async () => {
  const response = await axios.get(`${BASE_URL}/top-customers`);
  return response.data;
};

// Fetch orders by date
export const getOrdersByDate = async () => {
  const response = await axios.get(`${BASE_URL}/orders-by-date`);
  return response.data;
};
