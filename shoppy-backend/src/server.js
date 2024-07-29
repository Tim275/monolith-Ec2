const mysql = require("mysql");
require("dotenv").config({ path: "../.env" });

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).send({ status: "OK", message: "Server is healthy!" });
});

// Database connection Check Route
app.get("/database-health", (req, res) => {
  connection.query(
    "SELECT COUNT(*) as total_users FROM users",
    (error, results) => {
      if (error) {
        console.log("Database health failed:", error);
        return res
          .status(500)
          .send({ status: "FAILED", message: "Database health failed!" });
      }

      console.log("Database is healthy!", results);
      res.status(200).send({
        status: "OK",
        message: "Database is healthy!",
        result: results,
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
