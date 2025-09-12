import pkg from 'pg';
import { config } from './dbconfig.js';

const { Client } = pkg;

const client = new Client(config);

async function setupDB() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Create tables
    const createUsuario = `
      CREATE TABLE IF NOT EXISTS Usuario (
        userid TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `;

    const createCanciones = `
      CREATE TABLE IF NOT EXISTS Canciones (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL
      );
    `;

    const createEscucha = `
      CREATE TABLE IF NOT EXISTS Escucha (
        id SERIAL PRIMARY KEY,
        usuarioid TEXT NOT NULL REFERENCES Usuario(userid),
        cancionid INTEGER NOT NULL REFERENCES Canciones(id),
        reproducciones INTEGER DEFAULT 0
      );
    `;

    await client.query(createUsuario);
    console.log('Usuario table created');

    await client.query(createCanciones);
    console.log('Canciones table created');

    await client.query(createEscucha);
    console.log('Escucha table created');

    // Insert some sample songs
    const insertSongs = `
      INSERT INTO Canciones (nombre) VALUES
      ('Song 1'),
      ('Song 2'),
      ('Song 3')
      ON CONFLICT DO NOTHING;
    `;

    await client.query(insertSongs);
    console.log('Sample songs inserted');

    await client.end();
    console.log('Database setup complete');
  } catch (err) {
    console.error('Error setting up database:', err);
  }
}

setupDB();
