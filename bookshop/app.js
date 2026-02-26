require("dotenv").config(); 


const express = require("express");
const session = require("express-session");

const app = express();

app.use(express.json());

app.use(session({
  secret: "replace-this-secret",
  resave: false,
  saveUninitialized: false
}));
module.exports = app;


const bcrypt = require("bcrypt");
const db = require("./db");

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  try {
    await db.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash]
    );
    res.json({ status: "ok" });
  } catch {
    res.status(409).json({ error: "User exists" });
  }
});


app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await db.execute(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (!rows.length) return res.status(401).json({ error: "Invalid login" });

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password);

  if (!ok) return res.status(401).json({ error: "Invalid login" });

  req.session.userId = user.id;
  res.json({ status: "logged in" });
});


function auth(req, res, next) {
  if (!req.session.userId)
    return res.status(401).json({ error: "Unauthorized" });
  next();
}


app.get("/api/books", auth, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM books");
  res.json(rows);
});

app.get("/api/is-logged", auth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const [rows] = await db.execute(
      "SELECT username FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      logged: true,
      username: rows[0].username
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/api/books/:id", auth, async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM books WHERE id = ?",
    [req.params.id]
  );

  if (!rows.length) return res.sendStatus(404);
  res.json(rows[0]);
});

app.post("/books", auth, async (req, res) => {
  const { title, author, price } = req.body;

  const [result] = await db.execute(
    "INSERT INTO books (title, author, price) VALUES (?, ?, ?)",
    [title, author, price]
  );

  res.json({ id: result.insertId });
});

app.delete("/books/:id", auth, async (req, res) => {
  const [result] = await db.execute(
    "DELETE FROM books WHERE id = ?",
    [req.params.id]
  );

  if (!result.affectedRows) return res.sendStatus(404);
  res.json({ status: "deleted" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

