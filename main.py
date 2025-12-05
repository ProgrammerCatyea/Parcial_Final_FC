from fastapi import FastAPI, HTTPException, Query
from typing import List
from collections import defaultdict

from models import (
    Jugador, JugadorCreate,
    Partido, PartidoCreate,
    Estadistica, EstadisticaCreate
)

app = FastAPI(
    title="sigmotoa FC - Gestión Deportiva",
    version="1.0.0"
)

jugadores: List[Jugador] = []
partidos: List[Partido] = []
estadisticas: List[Estadistica] = []

next_jugador_id = 1
next_partido_id = 1
next_estadistica_id = 1



def get_jugador_by_id(jugador_id: int):
    return next((j for j in jugadores if j.id == jugador_id), None)

def get_partido_by_id(partido_id: int):
    return next((p for p in partidos if p.id == partido_id), None)

def get_estadistica_by_id(est_id: int):
    return next((e for e in estadisticas if e.id == est_id), None)

def validar_dorsal_unico(dorsal: int, excluir: int = None):
    for j in jugadores:
        if j.dorsal == dorsal and j.id != excluir:
            raise HTTPException(
                status_code=400,
                detail=f"El dorsal {dorsal} ya está asignado al jugador {j.nombre}."
            )

@app.get("/")
def root():
    return {"message": "sigmotoa FC funcionando"}

@app.get("/hello/{nombre}")
def hello(nombre: str):
    return {"message": f"Bienvenido a sigmotoa FC, {nombre}"}



@app.post("/jugadores", response_model=Jugador, status_code=201)
def crear_jugador(jugador_in: JugadorCreate):
    global next_jugador_id

    validar_dorsal_unico(jugador_in.dorsal)

    nuevo = Jugador(id=next_jugador_id, **jugador_in.dict())
    next_jugador_id += 1
    jugadores.append(nuevo)
    return nuevo


@app.get("/jugadores", response_model=List[Jugador])
def listar_jugadores():
    return jugadores


@app.get("/jugadores/{jugador_id}", response_model=Jugador)
def obtener_jugador(jugador_id: int):
    jugador = get_jugador_by_id(jugador_id)
    if not jugador:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    return jugador


@app.put("/jugadores/{jugador_id}", response_model=Jugador)
def actualizar_jugador(jugador_id: int, jugador_in: JugadorCreate):
    jugador = get_jugador_by_id(jugador_id)
    if not jugador:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")

    validar_dorsal_unico(jugador_in.dorsal, excluir=jugador_id)

    jugador.nombre = jugador_in.nombre
    jugador.dorsal = jugador_in.dorsal
    jugador.posicion = jugador_in.posicion
    jugador.edad = jugador_in.edad

    return jugador


@app.delete("/jugadores/{jugador_id}", status_code=204)
def eliminar_jugador(jugador_id: int):
    global jugadores
    jugador = get_jugador_by_id(jugador_id)
    if not jugador:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")

    jugadores = [j for j in jugadores if j.id != jugador_id]
    return
