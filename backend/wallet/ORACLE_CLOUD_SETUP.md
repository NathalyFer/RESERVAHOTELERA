# Configuración para Oracle Cloud Autonomous Database

## 🌐 Obtener Información de Conexión

### 1. Accede a Oracle Cloud Console
- Ve a: https://cloud.oracle.com
- Inicia sesión con tu cuenta

### 2. Navega a tu Base de Datos
- **Menu** → **Oracle Database** → **Autonomous Database**
- Selecciona tu instancia de base de datos

### 3. Obtén los Datos de Conexión
- Click en **"DB Connection"** o **"Database Connection"**
- Verás información como:
  - **Host**: `adb.us-ashburn-1.oraclecloud.com` (varía según región)
  - **Port**: `1522` (con TLS/SSL)
  - **Service Name**: `tu_db_high.adb.oraclecloud.com`

---

## 🔧 Opción 1: Conexión con Connection String (Recomendada)

### Paso 1: Obtén el Connection String

En Oracle Cloud Console → DB Connection, copia el **Connection String** para el nivel de servicio que prefieras:
- **high**: Máximo rendimiento, más recursos
- **medium**: Balance entre rendimiento y recursos
- **low**: Menor consumo de recursos

Ejemplo de Connection String:
```
(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=k8j2h3k4l5m6n7o8_mydb_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))
```

### Paso 2: Configura tu archivo `.env`

Edita `backend/.env`:

```env
DB_USER=ADMIN
DB_PASS=TuPasswordSeguro123
DB_DSN=(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=tu_servicio_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))
```

**Importante**: Reemplaza:
- `TuPasswordSeguro123` con tu contraseña de ADMIN
- El connection string completo con el que copiaste de Oracle Cloud

---

## 🔐 Opción 2: Conexión con Wallet (Más Segura)

### Paso 1: Descargar el Wallet

1. En Oracle Cloud Console → DB Connection
2. Click en **"Download Wallet"**
3. Ingresa una contraseña para el wallet (guárdala)
4. Se descargará un archivo ZIP (ej: `Wallet_MyDB.zip`)

### Paso 2: Extraer el Wallet

```bash
# Crea una carpeta para el wallet
mkdir C:\oracle\wallet

# Extrae el ZIP en esa carpeta
# Deberías ver archivos como: tnsnames.ora, sqlnet.ora, cwallet.sso, etc.
```

### Paso 3: Configurar el Código

Edita `backend/main.py` y agrega antes de la línea de conexión:

```python
import os
from dotenv import load_dotenv

load_dotenv()

# Configurar el wallet
os.environ['TNS_ADMIN'] = r'C:\oracle\wallet'  # Ruta donde extrajiste el wallet

DB_USER = os.getenv("DB_USER", "ADMIN")
DB_PASS = os.getenv("DB_PASS", "TU_PASSWORD")
DB_DSN  = os.getenv("DB_DSN", "mydb_high")  # Nombre del servicio (sin el dominio completo)

# Conexión
connection = oracledb.connect(user=DB_USER, password=DB_PASS, dsn=DB_DSN, encoding="UTF-8")
```

### Paso 4: Configura tu archivo `.env`

```env
DB_USER=ADMIN
DB_PASS=TuPasswordSeguro123
DB_DSN=mydb_high
```

---

## 📋 Resumen de Puertos

| Tipo de Conexión | Puerto | Protocolo |
|------------------|--------|-----------|
| **Oracle Cloud Autonomous DB** (con TLS) | **1522** | tcps |
| Oracle Cloud (sin TLS) | 1521 | tcp |
| Oracle Local (XE, Standard) | 1521 | tcp |

**Para Oracle Cloud, usa el puerto 1522 con protocolo `tcps` (TLS/SSL)**

---

## ✅ Verificar la Conexión

### Prueba Rápida con Python

Crea un archivo `test_connection.py` en `backend/`:

```python
import oracledb
from dotenv import load_dotenv
import os

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_DSN = os.getenv("DB_DSN")

print(f"Intentando conectar como: {DB_USER}")
print(f"DSN: {DB_DSN[:50]}...")  # Muestra solo los primeros 50 caracteres

try:
    connection = oracledb.connect(user=DB_USER, password=DB_PASS, dsn=DB_DSN, encoding="UTF-8")
    print("✅ Conexión exitosa!")
    
    cursor = connection.cursor()
    cursor.execute("SELECT 'Hello from Oracle Cloud!' FROM DUAL")
    result = cursor.fetchone()
    print(f"Resultado: {result[0]}")
    
    cursor.close()
    connection.close()
except Exception as e:
    print(f"❌ Error de conexión: {e}")
```

Ejecuta:
```bash
python test_connection.py
```

---

## 🚨 Solución de Problemas

### Error: "DPI-1047: Cannot locate a 64-bit Oracle Client library"

Oracle Cloud requiere Oracle Instant Client. Descárgalo e instálalo:

1. Ve a: https://www.oracle.com/database/technologies/instant-client/downloads.html
2. Descarga **Instant Client Basic** para Windows
3. Extrae el ZIP en `C:\oracle\instantclient_21_x`
4. Agrega la ruta al PATH del sistema:
   - Windows: Panel de Control → Sistema → Variables de entorno
   - Agrega `C:\oracle\instantclient_21_x` a la variable PATH

### Error: "ORA-12170: TNS:Connect timeout occurred"

- Verifica que tu IP esté en la lista de acceso (Access Control List) en Oracle Cloud
- Oracle Cloud Console → Tu DB → Network → Access Control List
- Agrega tu IP pública o permite todas las IPs (0.0.0.0/0) para pruebas

### Error: "ORA-01017: invalid username/password"

- Verifica que el usuario sea `ADMIN` (mayúsculas)
- Confirma la contraseña en Oracle Cloud Console
- Si olvidaste la contraseña, puedes resetearla desde la consola

---

## 🔒 Seguridad

- **Nunca** compartas tu wallet o contraseñas
- Usa la Access Control List para restringir IPs
- Considera usar Oracle Cloud Vault para gestionar secretos
- El archivo `.env` está protegido por `.gitignore`

---

## 📝 Ejemplo Completo de `.env` para Oracle Cloud

```env
# Usuario (por defecto es ADMIN)
DB_USER=ADMIN

# Contraseña que configuraste al crear la base de datos
DB_PASS=MiPassword123!

# Connection String (copia desde Oracle Cloud Console)
DB_DSN=(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=k8j2h3k4l5m6n7o8_mydb_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))
```

---

## 🎯 Próximos Pasos

1. Configura tu archivo `.env` con los datos de Oracle Cloud
2. Instala las dependencias: `pip install -r requirements.txt`
3. Prueba la conexión: `python test_connection.py`
4. Crea la tabla `Habitacion` (ver `backend/README.md`)
5. Inicia el servidor: `python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000`
