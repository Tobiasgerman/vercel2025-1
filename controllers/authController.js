// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../services/dbService.js';
const JWT_SECRET = process.env.JWT_SECRET || 'cambiame_en_produccion';

export async function crearUsuario(req, res) {
  const { userid, nombre, password, rol } = req.body;
  if (!userid || !nombre || !password) return res.status(400).json({ error: "Faltan campos" });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const q = `INSERT INTO Usuario(userid, nombre, password, rol) VALUES($1,$2,$3,$4) RETURNING userid, nombre, rol`;
    const result = await db.query(q, [userid, nombre, hashed, rol || 'Usuario']);
    return res.status(201).json({ usuario: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  const { userid, password } = req.body;
  if (!userid || !password) return res.status(400).json({ error: "Faltan campos" });
  try {
    const q = "SELECT userid, nombre, password, rol FROM Usuario WHERE userid = $1";
    const r = await db.query(q, [userid]);
    if (r.rowCount === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    const dbUser = r.rows[0];
    const passOK = await bcrypt.compare(password, dbUser.password);
    if (!passOK) return res.status(401).json({ error: "Password inválido" });
    const payload = { userid: dbUser.userid, nombre: dbUser.nombre, rol: dbUser.rol };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
