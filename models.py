from datetime import date
from typing import Optional
from pydantic import BaseModel, Field

class JugadorBase(BaseModel):
    nombre: str = Field(..., min_length=1, description="Nombre completo del jugador")
    dorsal: int = Field(..., ge=1, le=99, description="Dorsal(1-99)")
    posicion: str = Field(
        ...,
        description="Posición del jugador: Defensa, Portero, Mediocampo o Delantero"
    )
    edad: Optional[int] = Field(None, ge=15, le=50, description="Edad del jugador")


class JugadorCreate(JugadorBase):
    pass

class Jugador(JugadorBase):
    id: int

    class Config:
        orm_mode = True


class Estadistica():
    pass


class PartidoBase(BaseModel):
    rival: str = Field(..., min_length=1, description="Nombre del equipo rival")
    fecha: date = Field(..., description="Fecha del partido")
    es_local: bool = Field(..., description="True si sigmotoa FC juega como local")


class PartidoCreate(PartidoBase):
    pass

class Partido(PartidoBase):
    id: int

    class Config:
        orm_mode = True



