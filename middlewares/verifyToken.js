// middlewares/verifyToken.js
import jwt from 'jsonwebtoken';
import db from '../services/dbService.js';
const JWT_SECRET = process.env.JWT_SECRET || 'cambiame_en_produccion';

export default async function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || req.headers['Auth'] || req.headers['auth'];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const parts = authHeader.split(' ');
  res.status(200).json({debug: "verifyToken - consulta de usuario realizada"}); // línea de depuración
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: "Invalid token format" });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Consultar la base de datos para obtener el rol actualizado del usuario
    const q = "SELECT userid, nombre, rol FROM Usuario WHERE userid = $1";
    const r = await db.query(q, [payload.userid]);
    res.status(200).json({debug: "verifyToken - consulta de usuario realizada"}); // línea de depuración
    if (r.rowCount === 0) return res.status(401).json({ error: "Usuario no encontrado" });
    const user = r.rows[0];
    console.log("verifyToken - usuario encontrado:", user);
    req.user = user; // Asignar usuario con rol actualizado
    next();
  } catch (err) {
    console.error("verifyToken - error:", err);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
