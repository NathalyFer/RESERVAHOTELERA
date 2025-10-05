from fastapi import FastAPI, UploadFile, Form, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from uuid import uuid4
import os, shutil
import oracledb

# Config
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

DB_USER = "ADMIN"
DB_PASS = "Meruemgato141#"

# Para Oracle Autonomous Database en modo Thin (sin wallet)
# Necesitas descargar el wallet y extraer tnsnames.ora, o usar el connection string completo
# Por ahora, configuramos para usar el wallet si existe
WALLET_DIR = os.path.join(os.path.dirname(__file__), "wallet")

# Conexión en modo THIN (no requiere Oracle Client instalado)
conn = None
try:
    if os.path.exists(WALLET_DIR):
        print(f"✓ Wallet encontrado en: {WALLET_DIR}")
        
        # Intentar con diferentes niveles de servicio
        services = [
            ("medium", "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.sa-santiago-1.oraclecloud.com))(connect_data=(service_name=g5a30620268988e_snft5posxfqahl3v_medium.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"),
            ("low", "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.sa-santiago-1.oraclecloud.com))(connect_data=(service_name=g5a30620268988e_snft5posxfqahl3v_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"),
            ("high", "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.sa-santiago-1.oraclecloud.com))(connect_data=(service_name=g5a30620268988e_snft5posxfqahl3v_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))")
        ]
        
        for service_name, connection_string in services:
            try:
                print(f"✓ Intentando conectar con servicio '{service_name}'...")
                
                # Método 1: Conectar con config_dir y wallet_location
                try:
                    conn = oracledb.connect(
                        user=DB_USER, 
                        password=DB_PASS, 
                        dsn=connection_string,
                        config_dir=WALLET_DIR,
                        wallet_location=WALLET_DIR,
                        wallet_password=""
                    )
                    print(f"✓ Conexión exitosa (método 1) con '{service_name}'!")
                    break
                except Exception as e1:
                    print(f"  Método 1 falló: {str(e1)[:80]}")
                    
                    # Método 2: Conectar solo con config_dir (TNS_ADMIN)
                    try:
                        os.environ['TNS_ADMIN'] = WALLET_DIR
                        conn = oracledb.connect(
                            user=DB_USER, 
                            password=DB_PASS, 
                            dsn=f"snft5posxfqahl3v_{service_name}"
                        )
                        print(f"✓ Conexión exitosa (método 2) con '{service_name}'!")
                        break
                    except Exception as e2:
                        print(f"  Método 2 falló: {str(e2)[:80]}")
                        continue
                        
            except Exception as service_error:
                print(f"  ✗ Falló con '{service_name}': {str(service_error)[:100]}")
                continue
        
        if not conn:
            print(f"✗ No se pudo conectar con ningún servicio")
            print(f"  IMPORTANTE: Verifica en Oracle Cloud Console que:")
            print(f"  1. La base de datos esté ACTIVA (no detenida/pausada)")
            print(f"  2. La contraseña del usuario ADMIN sea correcta")
            print(f"  3. El wallet sea el correcto para esta base de datos")
    else:
        print(f"✗ No se encontró el directorio wallet en: {WALLET_DIR}")
        conn = None
except Exception as e:
    print(f"✗ Error general de conexión a Oracle: {e}")
    print(f"  Wallet dir: {WALLET_DIR}")
    print(f"  Usuario: {DB_USER}")
    conn = None

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8100", "http://127.0.0.1:8100", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos (fotos)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

class HabitacionOut(BaseModel):
    id: int
    nombre: str
    precio: float
    foto: str | None
    estado: str

@app.get("/habitaciones", response_model=list[HabitacionOut])
def listar_habitaciones():
    if not conn:
        raise HTTPException(status_code=503, detail="Base de datos no conectada. Configura el wallet de Oracle.")
    cur = conn.cursor()
    cur.execute("SELECT id_habitacion, nombre, precio, foto, estado FROM Habitacion ORDER BY id_habitacion")
    rows = cur.fetchall()
    cur.close()
    return [{"id": int(r[0]), "nombre": r[1], "precio": float(r[2]), "foto": r[3], "estado": r[4]} for r in rows]

@app.post("/habitaciones", response_model=HabitacionOut, status_code=201)
async def crear_habitacion(
    numero: int = Form(...),            
    tipo: str = Form(...),              
    nombre: str = Form(...),
    precio: float = Form(...),
    foto: UploadFile | None = File(None),
    estado: str = Form("Disponible")
):
    if not conn:
        raise HTTPException(status_code=503, detail="Base de datos no conectada. Configura el wallet de Oracle.")
    
    # Guardar fichero si viene
    foto_nombre = None
    if foto:
        foto_nombre = f"{uuid4().hex}_{os.path.basename(foto.filename)}"
        destino = os.path.join(UPLOAD_DIR, foto_nombre)
        with open(destino, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)

    # Insertar en Oracle y obtener id con RETURNING
    cur = conn.cursor()
    id_var = cur.var(oracledb.NUMBER)
    try:
        cur.execute(
            """INSERT INTO Habitacion (numero, tipo, nombre, foto, precio, estado) 
               VALUES (:1, :2, :3, :4, :5, :6) 
               RETURNING id_habitacion INTO :7""",
            (numero, tipo, nombre, foto_nombre, precio, estado, id_var)
        )
        conn.commit()
        new_id = int(id_var.getvalue()[0])
    except Exception as e:
        cur.close()
        raise HTTPException(status_code=500, detail=str(e))
    cur.close()

    foto_url = f"/uploads/{foto_nombre}" if foto_nombre else None
    return {"id": new_id, "nombre": nombre, "precio": precio, "foto": foto_url, "estado": estado}