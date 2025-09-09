-- tabla de usuarios
CREATE TABLE usuario (
  userid TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  password TEXT NOT NULL
);

-- tabla de canciones
CREATE TABLE canciones (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL
);

-- tabla escucha
CREATE TABLE escucha (
  id SERIAL PRIMARY KEY,
  usuarioid TEXT NOT NULL REFERENCES usuario(userid),
  cancionid INTEGER NOT NULL REFERENCES canciones(id),
  reproducciones INTEGER DEFAULT 0
);
