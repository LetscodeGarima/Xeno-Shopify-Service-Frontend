// src/components/Dashboard.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE = process.env.REACT_APP_API_BASE; // 👈 use .env variable

const Dashboard = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [summary, setSummary] = useState({});
  const [ordersByDate, setOrdersByDate] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // ----------------------
  // Register
  // ----------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/auth/register`, {
        name,
        email,
        password,
      });
      alert("Registration successful! Please login.");
      setIsRegistering(false);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // ----------------------
  // Login
  // ----------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });
      const receivedToken = res.data.token;
      setToken(receivedToken);
      localStorage.setItem("token", receivedToken);
      fetchData(receivedToken);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  // ----------------------
  // Fetch data
  // ----------------------
  const fetchData = useCallback(
    async (authToken = token) => {
      if (!authToken) return;
      setLoading(true);
      try {
        const params = {};
        if (startDate) params.startDate = startDate.toISOString().split("T")[0];
        if (endDate) params.endDate = endDate.toISOString().split("T")[0];

        const [summaryRes, ordersRes, customersRes] = await Promise.all([
          axios.get(`${API_BASE}/api/dashboard/summary`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get(`${API_BASE}/api/dashboard/orders-by-date`, {
            headers: { Authorization: `Bearer ${authToken}` },
            params,
          }),
          axios.get(`${API_BASE}/api/dashboard/top-customers`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        setSummary(summaryRes.data);
        setOrdersByDate(ordersRes.data);
        setTopCustomers(customersRes.data);
      } catch (err) {
        alert("Failed to fetch dashboard data. Maybe token expired.");
      }
      setLoading(false);
    },
    [token, startDate, endDate]
  );

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  const applyFilters = () => fetchData();

  // ----------------------
  // CSV Download
  // ----------------------
  const downloadCSV = async (url, filename) => {
    try {
      const res = await axios.get(`${API_BASE}${url}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch {
      alert("CSV download failed");
    }
  };

  // ----------------------
  // Chart Data
  // ----------------------
  const lineChartData = {
    labels: ordersByDate.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: "Revenue",
        data: ordersByDate.map((d) => Number(d.revenue) || 0),
        borderColor: "#3182ce",
        backgroundColor: "rgba(49,130,206,0.2)",
        tension: 0.3,
      },
      {
        label: "Orders",
        data: ordersByDate.map((d) => Number(d.orders_count) || 0),
        borderColor: "#48bb78",
        backgroundColor: "rgba(72,187,120,0.2)",
        tension: 0.3,
      },
    ],
  };

  const barChartData = {
    labels: ordersByDate.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: "Orders per Day",
        data: ordersByDate.map((d) => Number(d.orders_count) || 0),
        backgroundColor: "#4e73df",
      },
    ],
  };

  const pieChartData = {
    labels: topCustomers.map((c) => `${c.first_name} ${c.last_name}`),
    datasets: [
      {
        data: topCustomers.map((c) => Number(c.total_spent) || 0),
        backgroundColor: ["#3182ce", "#48bb78", "#f6ad55", "#ed64a6", "#9f7aea"],
      },
    ],
  };

  // ----------------------
  // Logout
  // ----------------------
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setSummary({});
    setOrdersByDate([]);
    setTopCustomers([]);
  };

  // ----------------------
  // Login/Register Screen
  // ----------------------
  if (!token) {
    return (
      <div className="login-container">
        <h2>{isRegistering ? "Register" : "Login"}</h2>
        <form
          onSubmit={isRegistering ? handleRegister : handleLogin}
          className="login-form"
        >
          {isRegistering && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>
        <p
          className="toggle-auth"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Don’t have an account? Register"}
        </p>
      </div>
    );
  }

  // ----------------------
  // Dashboard Screen
  // ----------------------
  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <h2>Xeno Dashboard</h2>
        <div>
          <button
            onClick={() =>
              document.getElementById("charts").scrollIntoView({ behavior: "smooth" })
            }
          >
            Charts
          </button>
          <button
            onClick={() =>
              document.getElementById("customers").scrollIntoView({ behavior: "smooth" })
            }
          >
            Top Customers
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Summary Cards */}
      <section id="overview" className="summary-grid">
        <div className="summary-card">
          <h3>Total Customers</h3>
          <p>{Number(summary.total_customers || 0).toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Total Orders</h3>
          <p>{Number(summary.total_orders || 0).toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p>₹{Number(summary.total_revenue || 0).toLocaleString()}</p>
        </div>
      </section>

      {/* Filters */}
      <div className="filters">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="End Date"
        />
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      {/* CSV Download */}
      <div className="csv-buttons">
        <button
          onClick={() =>
            downloadCSV(`/api/dashboard/export-top-customers`, "top_customers.csv")
          }
        >
          Download Top Customers CSV
        </button>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          {/* Line Chart */}
          <section id="charts" className="chart-container">
            <h2>📈 Revenue & Orders Trend</h2>
            <Line data={lineChartData} />
          </section>

          {/* Bar Chart */}
          <section className="chart-container">
            <h2>📊 Orders per Day</h2>
            <Bar data={barChartData} />
          </section>

          {/* Pie Chart */}
          <section className="chart-container small-chart">
            <h2>🥧 Revenue Share by Top Customers</h2>
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "right" },
                },
              }}
            />
          </section>

          {/* Top Customers */}
          <section id="customers" className="table-container">
            <h2>👑 Top 5 Customers by Spend</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, i) => (
                  <tr key={i}>
                    <td>
                      {c.first_name} {c.last_name}
                    </td>
                    <td>{c.email}</td>
                    <td>₹{Number(c.total_spent || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;