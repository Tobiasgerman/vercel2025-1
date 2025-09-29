// controllers/cancionController.js
import db from '../services/dbService.js';

export async function crearCancion(req, res) {
  const { id, nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: "Falta nombre" });
  try {
    if (id) {
      const q = "INSERT INTO Canciones(id, nombre) VALUES($1,$2) RETURNING id, nombre";
      const r = await db.query(q, [id, nombre]);
      return res.status(201).json({ cancion: r.rows[0] });
    } else {
      const q = "INSERT INTO Canciones(nombre) VALUES($1) RETURNING id, nombre";
      const r = await db.query(q, [nombre]);
      return res.status(201).json({ cancion: r.rows[0] });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function actualizarCancion(req, res) {
  const { id, nombre } = req.body;
  if (!id || !nombre) return res.status(400).json({ error: "Faltan id o nombre" });
  try {
    // Verificar que la canción existe
    const checkQ = "SELECT id FROM Canciones WHERE id = $1";
    const checkR = await db.query(checkQ, [id]);
    if (checkR.rowCount === 0) return res.status(404).json({ error: "Canción no encontrada" });

    const q = "UPDATE Canciones SET nombre = $2 WHERE id = $1 RETURNING id, nombre";
    const r = await db.query(q, [id, nombre]);
    return res.json({ cancion: r.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function eliminarCancion(req, res) {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Falta id" });
  try {
    // Verificar que la canción existe
    const checkQ = "SELECT id FROM Canciones WHERE id = $1";
    const checkR = await db.query(checkQ, [id]);
    if (checkR.rowCount === 0) return res.status(404).json({ error: "Canción no encontrada" });

    const q = "DELETE FROM Canciones WHERE id = $1 RETURNING id";
    const r = await db.query(q, [id]);
    return res.json({ ok: true, id: r.rows[0].id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
