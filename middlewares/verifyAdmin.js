// middlewares/verifyAdmin.js
export default function verifyAdmin(req, res, next) {
  // req.user debe existir (verifyToken debe haber corrido antes)
  if (!req.user) return res.status(401).json({ error: "No auth info" });
  // si el rol viene en el token lo usamos. Si no, fallamos seguro
  const rol = req.user.rol || req.user.role;
  if (!rol) return res.status(403).json({ error: "Rol no presente en token" });
  if (rol !== 'Admin') return res.status(403).json({ error: "Requiere rol Admin" });
  next();
}
