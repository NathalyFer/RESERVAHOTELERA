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
            descripcion TEXT,
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
    descripcion: str | None
    precio: float
    foto: str | None
    estado: str

@app.get("/habitaciones", response_model=list[HabitacionOut])
def listar_habitaciones():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id_habitacion, nombre, descripcion, precio, foto, estado FROM Habitacion ORDER BY id_habitacion")
    rows = cursor.fetchall()
    conn.close()
    return [{"id": int(r[0]), "nombre": r[1], "descripcion": r[2], "precio": float(r[3]), "foto": f"/uploads/{r[4]}" if r[4] else None, "estado": r[5]} for r in rows]

@app.post("/habitaciones", response_model=HabitacionOut, status_code=201)
async def crear_habitacion(
    numero: int = Form(...),            
    tipo: str = Form(...),              
    nombre: str = Form(...),
    descripcion: str = Form(""),
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
            """INSERT INTO Habitacion (numero, tipo, nombre, descripcion, foto, precio, estado) 
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (numero, tipo, nombre, descripcion, foto_nombre, precio, estado)
        )
        conn.commit()
        new_id = cursor.lastrowid
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
    conn.close()

    foto_url = f"/uploads/{foto_nombre}" if foto_nombre else None
    return {"id": new_id, "nombre": nombre, "descripcion": descripcion, "precio": precio, "foto": foto_url, "estado": estado}

@app.put("/habitaciones/{id_habitacion}", response_model=HabitacionOut)
async def actualizar_habitacion(
    id_habitacion: int,
    numero: int = Form(...),
    tipo: str = Form(...),
    nombre: str = Form(...),
    descripcion: str = Form(""),
    precio: float = Form(...),
    foto: UploadFile | None = File(None),
    estado: str = Form("Disponible")
):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Verificar que existe
    cursor.execute("SELECT foto FROM Habitacion WHERE id_habitacion = ?", (id_habitacion,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Habitación no encontrada")
    
    foto_actual = row[0]
    foto_nombre = foto_actual
    
    # Si viene nueva foto, guardarla
    if foto:
        foto_nombre = f"{uuid4().hex}_{os.path.basename(foto.filename)}"
        destino = os.path.join(UPLOAD_DIR, foto_nombre)
        with open(destino, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
        # Eliminar foto anterior si existe
        if foto_actual:
            old_path = os.path.join(UPLOAD_DIR, foto_actual)
            if os.path.exists(old_path):
                os.remove(old_path)
    
    # Actualizar en base de datos
    try:
        cursor.execute(
            """UPDATE Habitacion 
               SET numero = ?, tipo = ?, nombre = ?, descripcion = ?, foto = ?, precio = ?, estado = ?
               WHERE id_habitacion = ?""",
            (numero, tipo, nombre, descripcion, foto_nombre, precio, estado, id_habitacion)
        )
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
    conn.close()
    
    foto_url = f"/uploads/{foto_nombre}" if foto_nombre else None
    return {"id": id_habitacion, "nombre": nombre, "descripcion": descripcion, "precio": precio, "foto": foto_url, "estado": estado}
