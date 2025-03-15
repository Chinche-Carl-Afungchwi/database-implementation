const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from /public

// Serve index.html from public folder
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connect to SQLite database
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                pin TEXT NOT NULL,
                age INTEGER NOT NULL
            )`,
            (err) => {
                if (err) console.error("Error creating table:", err.message);
                else console.log("Table created or already exists.");
            }
        );
    }
});

// CRUD Endpoints
app.post("/add", (req, res) => {
    const { username, pin, age } = req.body;
    if (!username || !pin || !age) {
        return res.status(400).json({ error: "All fields are required." });
    }
    db.run(
        `INSERT INTO users (username, pin, age) VALUES (?, ?, ?)`,
        [username, pin, age],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, username, pin, age });
        }
    );
});

app.get("/users", (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM users WHERE id = ?`, id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User deleted", deletedID: id });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
