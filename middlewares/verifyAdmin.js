// middlewares/verifyAdmin.js
export default function verifyAdmin(req, res, next) {
  // req.user debe existir (verifyToken debe haber corrido antes)
  if (!req.user) {
    console.log("verifyAdmin - no hay información de usuario en req");
    return res.status(401).json({ error: "No auth info" });
  }
  res.status(200).json({debug: "verifyToken - consulta de usuario realizada"}); // línea de depuración
  // si el rol viene en el token lo usamos. Si no, fallamos seguro
  const rol = req.user.rol;
  console.log("verifyAdmin - rol del usuario:", rol);
  if (!rol) return res.status(403).json({ error: "Rol no presente en token" });
  if (rol.toLowerCase() !== 'admin') return res.status(403).json({ error: "Requiere rol Admin" });
  next();
}
