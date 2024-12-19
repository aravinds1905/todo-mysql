const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Routes

// Fetch all todos
app.get("/todos", (req, res) => {
  const query = "SELECT * FROM todos";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Add a new todo
app.post("/todos", (req, res) => {
  const { title } = req.body;
  const query = "INSERT INTO todos (title) VALUES (?)";
  db.query(query, [title], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, title, completed: false });
  });
});

// Update a todo (mark as completed/incomplete)
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const query = "UPDATE todos SET completed = ? WHERE id = ?";
  db.query(query, [completed, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, completed });
  });
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM todos WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id });
  });
});

// Mark a todo as completed
app.patch("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  db.query(
    "UPDATE todos SET completed = ? WHERE id = ?",
    [completed, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating task");
      } else {
        res.send("Task updated successfully");
      }
    }
  );
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
