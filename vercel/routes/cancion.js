// routes/cancion.js
import express from 'express';
import { crearCancion, actualizarCancion, eliminarCancion } from '../controllers/cancionController.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';

const router = express.Router();

// protegidas con token y admin
router.post('/cancion', verifyToken, verifyAdmin, crearCancion);
router.put('/cancion', verifyToken, verifyAdmin, actualizarCancion);
router.delete('/cancion', verifyToken, verifyAdmin, eliminarCancion);

export default router;
