// routes/escucha.js
import express from 'express';
import { registrarEscucha, obtenerEscuchas } from '../controllers/escuchaController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/escucho', verifyToken, registrarEscucha);
router.get('/escucho', verifyToken, obtenerEscuchas);

export default router;
