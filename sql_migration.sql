-- sql_migration.sql
-- Ejecutar esto en Neon/pgAdmin para migrar la BD de TP4-A a TP4-B

-- 1. Agregar columna rol a Usuario
ALTER TABLE Usuario ADD COLUMN IF NOT EXISTS rol TEXT DEFAULT 'Usuario';

-- 2. Actualizar usuarios existentes a rol 'Usuario' si no tienen rol
UPDATE Usuario SET rol = 'Usuario' WHERE rol IS NULL OR rol = '';

-- 3. Crear usuario admin de ejemplo (opcional, cambiar password hasheado)
-- Para hashear password: node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(h => console.log(h))"
-- Ejemplo con password 'admin123' hasheado (cambiar por el real)
INSERT INTO Usuario (userid, nombre, password, rol)
VALUES ('admin01', 'Admin Demo', '$2a$10$example.hash.here', 'Admin')
ON CONFLICT (userid) DO NOTHING;
