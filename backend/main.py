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
DB_DSN  = "SEJk:SA-SANTIAGO-1-AD-1"   

# Conexión (para prototipo; en prod usar SessionPool)
conn = oracledb.connect(user=DB_USER, password=DB_PASS, dsn=DB_DSN, encoding="UTF-8")

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