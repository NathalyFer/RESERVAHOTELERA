# Backend - API FastAPI

API REST para la gestión hotelera usando FastAPI y Oracle Database.

## 📋 Requisitos Previos

- Python 3.8 o superior
- Oracle Database (XE, Standard, o Enterprise)
- pip (gestor de paquetes de Python)

## 🚀 Instalación

### 1. Instalar Dependencias

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en el directorio `backend/` (ya existe una plantilla):

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de Oracle:

```env
DB_USER=tu_usuario_oracle
DB_PASS=tu_password_oracle
DB_DSN=localhost:1521/XEPDB1
```

**Parámetros:**
- `DB_USER`: Usuario de tu base de datos Oracle (ej: `SYSTEM`, `HR`, etc.)
- `DB_PASS`: Contraseña del usuario
- `DB_DSN`: Cadena de conexión en formato `host:puerto/servicio`
  - Oracle XE local: `localhost:1521/XEPDB1`
  - Oracle remoto: `192.168.1.100:1521/ORCL`

### 3. Crear la Tabla en Oracle

Conecta a tu base de datos Oracle y ejecuta:

```sql
CREATE TABLE Habitacion (
    id_habitacion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    numero NUMBER NOT NULL UNIQUE,
    tipo VARCHAR2(50) NOT NULL,
    precio NUMBER(10,2) NOT NULL,
    estado VARCHAR2(20) DEFAULT 'Disponible'
);

-- Datos de ejemplo
INSERT INTO Habitacion (numero, tipo, precio, estado) 
VALUES (101, 'Junior Suite', 150000, 'Disponible');

INSERT INTO Habitacion (numero, tipo, precio, estado) 
VALUES (102, 'Superior King', 180000, 'Disponible');

INSERT INTO Habitacion (numero, tipo, precio, estado) 
VALUES (103, 'Superior Twin', 160000, 'Ocupada');

COMMIT;
```

## ▶️ Ejecutar el Servidor

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

El servidor estará disponible en:
- **API**: http://localhost:8000
- **Documentación interactiva**: http://localhost:8000/docs
- **Documentación alternativa**: http://localhost:8000/redoc

## 📡 Endpoints Disponibles

### Listar Habitaciones
```http
GET /habitaciones
```

### Crear Habitación
```http
POST /habitaciones
Content-Type: application/json

{
  "numero": 104,
  "tipo": "Junior Suite",
  "precio": 150000,
  "estado": "Disponible"
}
```

### Actualizar Habitación
```http
PUT /habitaciones/{id_hab}
Content-Type: application/json

{
  "numero": 104,
  "tipo": "Junior Suite",
  "precio": 160000,
  "estado": "Ocupada"
}
```

### Eliminar Habitación
```http
DELETE /habitaciones/{id_hab}
```

## 🔧 Solución de Problemas

### Error: "No module named 'fastapi'"
```bash
pip install -r requirements.txt
```

### Error: "DPI-1047: Cannot locate a 64-bit Oracle Client library"
Necesitas instalar Oracle Instant Client:
1. Descarga desde: https://www.oracle.com/database/technologies/instant-client/downloads.html
2. Extrae el archivo ZIP
3. Agrega la ruta al PATH del sistema

### Error: "ORA-12541: TNS:no listener"
- Verifica que Oracle Database esté corriendo
- Confirma el puerto (por defecto 1521)
- Verifica el nombre del servicio (XEPDB1 para Oracle XE)

### Error: "ORA-01017: invalid username/password"
- Verifica las credenciales en el archivo `.env`
- Asegúrate de que el usuario tenga permisos

## 🔒 Seguridad

- **NUNCA** subas el archivo `.env` al repositorio
- El archivo `.gitignore` ya está configurado para ignorar `.env`
- Usa `.env.example` como plantilla para compartir la estructura

## 📝 Notas

- El servidor usa `--reload` para desarrollo (reinicia automáticamente al detectar cambios)
- Para producción, usa un servidor ASGI como Gunicorn con workers de Uvicorn
- La conexión a la base de datos es simple (no usa pool). Para producción, implementa connection pooling
