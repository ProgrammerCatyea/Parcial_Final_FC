from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class JugadorBase(BaseModel):
    nombre: str = Field(..., min_length=1, description="Nombre completo del jugador")
    dorsal: int = Field(..., ge=1, le=99, description="Dorsal (1-99)")
    posicion: str = Field(
        ...,
        description="Posición en el campo (Portero, Defensa, Mediocampo, Delantero)"
    )
    edad: Optional[int] = Field(None, ge=15, le=50, description="Edad del jugador")


class JugadorCreate(JugadorBase):
    pass

class Jugador(JugadorBase):
    id: int

    class Config:
        orm_mode = True


class PartidoBase(BaseModel):
    rival: str = Field(..., min_length=1, description="Nombre del equipo rival")
    fecha: date = Field(..., description="Fecha del partido")
    es_local: bool = Field(..., description="True si sigmotoa FC juega de local")


class PartidoCreate(PartidoBase):
    pass

class Partido(PartidoBase):
    id: int

    class Config:
        orm_mode = True


class EstadisticaBase(BaseModel):
    jugador_id: int = Field(..., description="Id del jugador al que pertenecen las estadísticas")
    partido_id: int = Field(..., description="Id del partido jugado")
    goles: int = Field(0, ge=0, description="Goles anotados en el partido")
    asistencias: int = Field(0, ge=0, description="Asistencias en el partido")
    minutos: int = Field(0, ge=0, le=120, description="Minutos jugados")
    calificacion: float = Field(0, ge=0, le=10, description="Nota del rendimiento (0-10)")


class EstadisticaCreate(EstadisticaBase):
    pass

class Estadistica(EstadisticaBase):
    id: int

    class Config:
        orm_mode = True

