
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import oracledb
import os
from dotenv import load_dotenv

load_dotenv()  # opcional: usa .env para credenciales

DB_USER = os.getenv("DB_USER", "TU_USUARIO")
DB_PASS = os.getenv("DB_PASS", "TU_PASSWORD")
DB_DSN  = os.getenv("DB_DSN", "localhost:8100")  # ajusta host:port/service

# Conexión simple (para prototipo). Para producción usa pool
connection = oracledb.connect(user=DB_USER, password=DB_PASS, dsn=DB_DSN, encoding="UTF-8")

app = FastAPI()

# CORS (permite peticiones desde ionic serve)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8100", "http://127.0.0.1:8100", "*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HabitacionIn(BaseModel):
    numero: int
    tipo: str
    precio: float
    estado: str = "Disponible"

class HabitacionOut(HabitacionIn):
    id_habitacion: int

@app.get("/habitaciones", response_model=List[HabitacionOut])
def listar_habitaciones():
    cur = connection.cursor()
    cur.execute("SELECT id_habitacion, numero, tipo, precio, estado FROM Habitacion ORDER BY numero")
    rows = cur.fetchall()
    result = []
    for r in rows:
        result.append({
            "id_habitacion": int(r[0]),
            "numero": int(r[1]),
            "tipo": r[2],
            "precio": float(r[3]),
            "estado": r[4]
        })
    cur.close()
    return result

@app.post("/habitaciones", status_code=201)
def crear_habitacion(h: HabitacionIn):
    try:
        cur = connection.cursor()
        cur.execute(
            "INSERT INTO Habitacion (numero, tipo, precio, estado) VALUES (:1, :2, :3, :4)",
            (h.numero, h.tipo, h.precio, h.estado)
        )
        connection.commit()
        cur.close()
        return {"message": "Habitación creada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/habitaciones/{id_hab}")
def actualizar_habitacion(id_hab: int, h: HabitacionIn):
    cur = connection.cursor()
    cur.execute(
        "UPDATE Habitacion SET numero=:1, tipo=:2, precio=:3, estado=:4 WHERE id_habitacion=:5",
        (h.numero, h.tipo, h.precio, h.estado, id_hab)
    )
    connection.commit()
    if cur.rowcount == 0:
        cur.close()
        raise HTTPException(status_code=404, detail="No encontrado")
    cur.close()
    return {"updated": cur.rowcount}

@app.delete("/habitaciones/{id_hab}")
def eliminar_habitacion(id_hab: int):
    cur = connection.cursor()
    cur.execute("DELETE FROM Habitacion WHERE id_habitacion=:1", (id_hab,))
    connection.commit()
    deleted = cur.rowcount
    cur.close()
    if deleted == 0:
        raise HTTPException(status_code=404, detail="No encontrado")
    return {"deleted": deleted}
