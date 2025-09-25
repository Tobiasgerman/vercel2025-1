-- 1. agregar columna rol
ALTER TABLE Usuario ADD COLUMN IF NOT EXISTS rol TEXT DEFAULT 'Usuario';

-- 2. actualizar usuarios existentes a rol Usuario (si hace falta)
UPDATE Usuario SET rol = 'Usuario' WHERE rol IS NULL OR rol = '';

-- 3. crear un usuario admin de ejemplo (si querés)
-- reemplazar userid, nombre, password_hasheado por lo que corresponda
-- ejemplo con password 'admin123' hasheado desde node o bcrypt
-- si preferís crear manual: insertar con password ya hasheado
INSERT INTO Usuario (userid, nombre, password, rol)
VALUES ('admin01', 'Admin Demo', '$2b$10$REPLACE_BY_HASHED_PASSWORD', 'Admin')
ON CONFLICT (userid) DO NOTHING;
