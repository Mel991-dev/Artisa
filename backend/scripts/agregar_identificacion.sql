-- Script para agregar campo de identificación única a la tabla Usuario
-- Ejecutar en la base de datos 'artisa'

USE [artisa]
GO

-- Agregar campo de identificación única
ALTER TABLE [dbo].[Usuario] ADD [identificacion] [nvarchar](20) NULL;
GO

-- Crear constraint único para identificación
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [UQ_Usuario_Identificacion] UNIQUE ([identificacion]);
GO

-- Crear índice para búsquedas rápidas
CREATE INDEX [IX_Usuario_Identificacion] ON [dbo].[Usuario] ([identificacion]);
GO

-- Crear índice compuesto para búsquedas por identificación y correo
CREATE INDEX [IX_Usuario_Identificacion_Correo] ON [dbo].[Usuario] ([identificacion], [correo]);
GO

-- Verificar que los cambios se aplicaron correctamente
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Usuario' AND COLUMN_NAME = 'identificacion';
GO

-- Verificar constraints únicos
SELECT 
    CONSTRAINT_NAME,
    COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_NAME = 'Usuario' AND CONSTRAINT_NAME LIKE '%Identificacion%';
GO

-- Verificar índices creados
SELECT 
    i.name AS IndexName,
    c.name AS ColumnName
FROM sys.indexes i
INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
WHERE i.object_id = OBJECT_ID('Usuario') AND c.name = 'identificacion';
GO

PRINT 'Script de migración completado exitosamente.';
PRINT 'Campo identificacion agregado a la tabla Usuario.';
PRINT 'Constraints e índices creados correctamente.';
GO 