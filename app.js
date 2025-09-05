import { config } from './dbconfig.js';
import express from "express";
import 'dotenv/config';
import pkg from 'pg';
import bcrypt from 'bcrypt';

const { Client } = pkg;

const app = express();
const PORT = 8000;

app.use(express.json());

app.use((req, res, next) => {
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});


app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/about', (req, res) => {
  res.send('About route 🎉 ');
});

app.get('/canciones', async (req, res) => {
  const client = new Client(config);
  await client.connect();
  let result = await client.query("select * from public.canciones");
  await client.end();
  console.log(result.rows);
  res.send(result.rows);
});

app.post('/crearusuario', async (req, res) => {
  const { nombre, password } = req.body;

  if (!nombre || !password) {
    return res.status(400).json({ error: "Faltan datos: nombre y password son requeridos" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = new Client(config);
    await client.connect();

    const query = "INSERT INTO usuario (nombre, password) VALUES ($1, $2) RETURNING *";
    const values = [nombre, hashedPassword];
    const result = await client.query(query, values);

    await client.end();

    res.status(201).json({ usuario: result.rows[0] });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});



app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
