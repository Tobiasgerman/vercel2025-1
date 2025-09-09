// app.js
import express from "express";
import pkg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from './dbconfig.js';
import 'dotenv/config';

const { Client } = pkg;
const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'cambiame_en_produccion';

app.use(express.json());

// logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// middleware para verificar token Bearer
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: "Invalid token format" });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // payload debe contener userid y nombre
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

/*
  POST /crearusuario
  recibe JSON: { userid, nombre, password }
  crea usuario con password hasheado
*/
app.post('/crearusuario', async (req, res) => {
  const { userid, nombre, password } = req.body;
  if (!userid || !nombre || !password) {
    return res.status(400).json({ error: "Faltan campos: userid, nombre y password son requeridos" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const client = new Client(config);
    await client.connect();
    const query = `INSERT INTO Usuario (userid, nombre, password) VALUES ($1, $2, $3) RETURNING userid, nombre`;
    const vals = [userid, nombre, hashed];
    const result = await client.query(query, vals);
    await client.end();
    return res.status(201).json({ usuario: result.rows[0] });
  } catch (err) {
    // si ya existe la PK, pg lanza un error de integridad
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

/*
  POST /login
  recibe JSON: { userid, password }
  valida y devuelve { token }
*/
app.post('/login', async (req, res) => {
  const { userid, password } = req.body;
  if (!userid || !password) return res.status(400).json({ error: "Faltan campos: userid y password" });

  const client = new Client(config);
  try {
    await client.connect();
    const q = "SELECT userid, nombre, password FROM Usuario WHERE userid = $1";
    const r = await client.query(q, [userid]);
    await client.end();

    if (r.rowCount === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const dbUser = r.rows[0];
    const passOK = await bcrypt.compare(password, dbUser.password);
    if (!passOK) return res.status(401).json({ error: "Password inválido" });

    const payload = { userid: dbUser.userid, nombre: dbUser.nombre };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

/*
  GET /escucho
  usa token Bearer en header Authorization
  devuelve lista de canciones escuchadas por el usuario autenticado y sus reproducciones
  respuesta: [{ id, nombre, reproducciones }]
*/
app.get('/escucho', authMiddleware, async (req, res) => {
  const userid = req.user.userid;
  const client = new Client(config);
  try {
    await client.connect();
    const q = `
      SELECT c.id, c.nombre, COALESCE(e.reproducciones,0) AS reproducciones
      FROM Canciones c
      JOIN Escucha e ON e.cancionid = c.id
      WHERE e.usuarioid = $1
      ORDER BY e.reproducciones DESC
    `;
    const r = await client.query(q, [userid]);
    await client.end();
    return res.json({ canciones: r.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.send('API Auth — OK'));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
