const path = require("path");
const express = require("express");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database setup ---
const db = new Database(path.join(__dirname, "curio.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- Register a new user ---
app.post("/api/register", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ ok: false, error: "Usuario y contraseña son obligatorios." });
  }
  if (username.trim().length < 3) {
    return res.status(400).json({ ok: false, error: "El usuario debe tener al menos 3 caracteres." });
  }
  if (password.length < 4) {
    return res.status(400).json({ ok: false, error: "La contraseña debe tener al menos 4 caracteres." });
  }

  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username.trim());
  if (existing) {
    return res.status(409).json({ ok: false, error: "Ese usuario ya existe." });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(username.trim(), passwordHash);

  return res.json({ ok: true, message: "Usuario creado correctamente TEST-999." });
});

// --- Log in an existing user ---
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ ok: false, error: "Usuario y contraseña son obligatorios." });
  }

  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username.trim());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ ok: false, error: "Usuario o contraseña incorrectos." });
  }

  return res.json({ ok: true, message: "Acceso correcto." });
});

// --- Dev-only: list stored users (never returns plaintext passwords) ---
app.get("/api/users", (req, res) => {
  const rows = db.prepare("SELECT id, username, password_hash, created_at FROM users ORDER BY id DESC").all();
  res.json({ ok: true, users: rows });
});

app.listen(PORT, () => {
  console.log(`Curio backend escuchando en http://localhost:${PORT}`);
  console.log(`Base de datos SQLite en: ${path.join(__dirname, "curio.db")}`);
});
