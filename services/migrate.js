import bcrypt from 'bcryptjs';
import db from './dbService.js';

// SQL from spoticfy.sql
const baseSchema = `
-- tabla de usuarios
CREATE TABLE IF NOT EXISTS usuario (
  userid TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  password TEXT NOT NULL
);

-- tabla de canciones
CREATE TABLE IF NOT EXISTS canciones (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL
);

-- tabla escucha
CREATE TABLE IF NOT EXISTS escucha (
  id SERIAL PRIMARY KEY,
  usuarioid TEXT NOT NULL REFERENCES usuario(userid),
  cancionid INTEGER NOT NULL REFERENCES canciones(id),
  reproducciones INTEGER DEFAULT 0
);
`;

// SQL from sql_migration.sql, adapted
const migrationSQL = async () => {
  // 1. agregar columna rol
  await db.query("ALTER TABLE usuario ADD COLUMN IF NOT EXISTS rol TEXT DEFAULT 'Usuario';");

  // 2. actualizar usuarios existentes a rol Usuario (si hace falta)
  await db.query("UPDATE usuario SET rol = 'Usuario' WHERE rol IS NULL OR rol = '';");

  // 3. crear un usuario admin de ejemplo
  const adminPassword = 'admin123';
  if (typeof adminPassword !== 'string') {
    throw new Error('Admin password must be a string');
  }
  const hashedAdminPassword = await bcrypt.hash(adminPassword.toString(), 10);
  await db.query(`
    INSERT INTO usuario (userid, nombre, password, rol)
    VALUES ('admin01', 'Admin Demo', $1, 'Admin')
    ON CONFLICT (userid) DO NOTHING;
  `, [hashedAdminPassword]);
};

async function runMigrations() {
  try {
    console.log('Running base schema...');
    await db.query(baseSchema);

    console.log('Running migrations...');
    await migrationSQL();

    console.log('Migrations completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await db.pool.end();
  }
}

runMigrations();
