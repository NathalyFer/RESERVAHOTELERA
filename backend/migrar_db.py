import sqlite3

DB_PATH = "habitaciones.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Verificar si la columna descripcion ya existe
cursor.execute("PRAGMA table_info(Habitacion)")
columns = [col[1] for col in cursor.fetchall()]

if 'descripcion' not in columns:
    print("Agregando columna 'descripcion'...")
    cursor.execute("ALTER TABLE Habitacion ADD COLUMN descripcion TEXT")
    conn.commit()
    print("✓ Columna 'descripcion' agregada exitosamente")
else:
    print("✓ La columna 'descripcion' ya existe")

conn.close()
print("✓ Migración completada")
