from fastapi import FastAPI, UploadFile, Form, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from uuid import uuid4
import os, shutil
import sqlite3

# Config
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Crear base de datos SQLite
DB_PATH = "habitaciones.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Habitacion (
            id_habitacion INTEGER PRIMARY KEY AUTOINCREMENT,
            numero INTEGER NOT NULL,
            tipo TEXT NOT NULL,
            nombre TEXT NOT NULL,
            foto TEXT,
            precio REAL NOT NULL,
            estado TEXT DEFAULT 'Disponible'
        )
    """)
    conn.commit()
    conn.close()
    print("✓ Base de datos SQLite inicializada")

init_db()

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
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id_habitacion, nombre, precio, foto, estado FROM Habitacion ORDER BY id_habitacion")
    rows = cursor.fetchall()
    conn.close()
    return [{"id": int(r[0]), "nombre": r[1], "precio": float(r[2]), "foto": f"/uploads/{r[3]}" if r[3] else None, "estado": r[4]} for r in rows]

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

    # Insertar en SQLite
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        cursor.execute(
            """INSERT INTO Habitacion (numero, tipo, nombre, foto, precio, estado) 
               VALUES (?, ?, ?, ?, ?, ?)""",
            (numero, tipo, nombre, foto_nombre, precio, estado)
        )
        conn.commit()
        new_id = cursor.lastrowid
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
    conn.close()

    foto_url = f"/uploads/{foto_nombre}" if foto_nombre else None
    return {"id": new_id, "nombre": nombre, "precio": precio, "foto": foto_url, "estado": estado}
