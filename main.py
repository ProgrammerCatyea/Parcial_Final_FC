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
async def root():
    return {"message": "sigmotoa FC data"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Bienvenido a sigmotoa FC {name}"}
