// index.js
import express from 'express';
import 'dotenv/config';
import './services/migrate.js'; // run migrations on startup
import authRoutes from './routes/auth.js';
import cancionRoutes from './routes/cancion.js';
import escuchaRoutes from './routes/escucha.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use((req,res,next)=>{
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// rutas
app.use('/', authRoutes);       // /crearusuario, /login
app.use('/', cancionRoutes);    // /cancion (POST, PUT, DELETE) admin only
app.use('/', escuchaRoutes);    // /escucho (POST, GET)

app.get('/', (req,res)=> res.send('API TP4-B — OK'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT}`);
});
