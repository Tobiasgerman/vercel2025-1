// controllers/escuchaController.js
import db from '../services/dbService.js';

export async function registrarEscucha(req, res) {
  // recibe JSON { id } donde id es id de la cancion
  const body = req.body || {};
  const cancionId = body.id;
  if (!cancionId) return res.status(400).json({ error: "Falta id de canción" });
  const userid = req.user?.userid;
  if (!userid) return res.status(401).json({ error: "No autenticado" });
  try {
    // Verificar que la canción existe en la base de datos
    const songCheck = "SELECT id FROM canciones WHERE id = $1";
    const songRes = await db.query(songCheck, [cancionId]);
    if (songRes.rowCount === 0) return res.status(404).json({ error: "Canción no encontrada" });

    // Si ya existe registro para usuario+cancion, incrementamos reproducciones
    const checkQ = "SELECT id, reproducciones FROM escucha WHERE usuarioid=$1 AND cancionid=$2";
    const r = await db.query(checkQ, [userid, cancionId]);
    if (r.rowCount === 0) {
      const insertQ = "INSERT INTO escucha(usuarioid, cancionid, reproducciones) VALUES($1,$2,1) RETURNING id";
      const insertR = await db.query(insertQ, [userid, cancionId]);
      return res.status(201).json({ ok: true, escuchaId: insertR.rows[0].id });
    } else {
      const id = r.rows[0].id;
      const updateQ = "UPDATE escucha SET reproducciones = reproducciones + 1 WHERE id = $1 RETURNING reproducciones";
      const updateR = await db.query(updateQ, [id]);
      return res.json({ ok: true, reproducciones: updateR.rows[0].reproducciones });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function obtenerEscuchas(req, res) {
  const userid = req.user?.userid;
  if (!userid) return res.status(401).json({ error: "No autenticado" });
  try {
    const q = `
      SELECT c.id, c.nombre, COALESCE(e.reproducciones,0) AS reproducciones
      FROM canciones c
      JOIN escucha e ON e.cancionid = c.id
      WHERE e.usuarioid = $1
      ORDER BY e.reproducciones DESC
    `;
    const r = await db.query(q, [userid]);
    if (r.rows.length === 0) {
      return res.json({ message: "Todavía no escuchaste ninguna canción" });
    }
    return res.json({ canciones: r.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
