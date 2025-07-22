-- Script para crear la tabla GaleriaArtesano
-- Incidencia 4.2.3: Gestión de fotos y galería

-- Crear tabla GaleriaArtesano
CREATE TABLE GaleriaArtesano (
    id_galeria INT IDENTITY(1,1) PRIMARY KEY,
    id_artesano INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    descripcion VARCHAR(500) NULL,
    es_principal BIT DEFAULT 0,
    fecha_subida DATETIME DEFAULT GETDATE(),
    
    -- Foreign key a la tabla Artesano
    CONSTRAINT FK_GaleriaArtesano_Artesano 
        FOREIGN KEY (id_artesano) 
        REFERENCES Artesano(id_artesano)
        ON DELETE CASCADE
);

-- Crear índice para mejorar rendimiento en consultas por artesano
CREATE INDEX IX_GaleriaArtesano_id_artesano 
ON GaleriaArtesano(id_artesano);

-- Crear índice para ordenar por fecha
CREATE INDEX IX_GaleriaArtesano_fecha 
ON GaleriaArtesano(fecha_subida);

-- Insertar datos de prueba (opcional)
-- INSERT INTO GaleriaArtesano (id_artesano, nombre_archivo, ruta_archivo, descripcion, es_principal)
-- VALUES 
--     (1, 'taller-artesano1.jpg', '/uploads/artesanos/galeria/taller-artesano1.jpg', 'Mi taller de cerámica', 1),
--     (1, 'trabajo-artesano1.jpg', '/uploads/artesanos/galeria/trabajo-artesano1.jpg', 'Algunos de mis trabajos', 0),
--     (1, 'herramientas-artesano1.jpg', '/uploads/artesanos/galeria/herramientas-artesano1.jpg', 'Mis herramientas de trabajo', 0);

-- Comentarios sobre la estructura:
-- id_galeria: Identificador único de cada foto
-- id_artesano: Referencia al artesano propietario
-- nombre_archivo: Nombre original del archivo subido
-- ruta_archivo: Ruta completa donde se almacena la imagen
-- descripcion: Descripción opcional de la foto
-- es_principal: Indica si es la foto principal del perfil (solo una por artesano)
-- fecha_subida: Fecha y hora de subida automática 