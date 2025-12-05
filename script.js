
let jugadores = [
    {
        id: 1,
        nombre: "Juan Pérez",
        posicion: "Delantero",
        dorsal: 9,
        descripcion: "Goleador del equipo, especialista en definición.",
        foto: "img/jugador1.jpg",
        goles: 5,
        asistencias: 2,
        // NUEVOS CAMPOS
        fechaNacimiento: "1998-05-10",
        nacionalidad: "Colombia",
        pieDominante: "Derecho",
        altura: 180,
        peso: 75,
        estado: "Activo" 
    },
    {
        id: 2,
        nombre: "Carlos Gómez",
        posicion: "Portero",
        dorsal: 1,
        descripcion: "Reflejos rápidos y muy seguro bajo los tres palos.",
        foto: "img/jugador2.jpg",
        goles: 0,
        asistencias: 0,
        fechaNacimiento: "1997-03-22",
        nacionalidad: "Colombia",
        pieDominante: "Derecho",
        altura: 185,
        peso: 80,
        estado: "Activo"
    },
    {
        id: 3,
        nombre: "Andrés López",
        posicion: "Defensa central",
        dorsal: 4,
        descripcion: "Líder en la defensa, fuerte en el juego aéreo.",
        foto: "img/jugador3.jpg",
        goles: 1,
        asistencias: 1,
        fechaNacimiento: "1996-11-02",
        nacionalidad: "Colombia",
        pieDominante: "Derecho",
        altura: 183,
        peso: 78,
        estado: "Activo"
    },
    {
        id: 4,
        nombre: "Miguel Ramírez",
        posicion: "Mediocampista",
        dorsal: 8,
        descripcion: "Encargado de la creación de juego en el medio campo.",
        foto: "img/jugador4.jpg",
        goles: 2,
        asistencias: 3,
        fechaNacimiento: "1999-07-15",
        nacionalidad: "Colombia",
        pieDominante: "Izquierdo",
        altura: 176,
        peso: 72,
        estado: "Activo"
    }
];


const partidos = [
    {
        id: 1,
        rival: "Real Madrid",
        fecha: "2025-12-10",
        hora: "20:00",
        estadio: "Estadio Central",
        golesLocal: 2,
        golesRival: 1,
        tipo: "Liga",
        mvpId: 1
    },
    {
        id: 2,
        rival: "FC Barcelona",
        fecha: "2025-12-15",
        hora: "18:30",
        estadio: "Camp Nou",
        golesLocal: 0,
        golesRival: 0,
        tipo: "Amistoso",
        mvpId: null
    }
];

/
let rendimientos = []; 


let jugadorActual = null;



document.addEventListener("DOMContentLoaded", () => {
    const gridJugadores   = document.querySelector(".players-grid");
    const listaPartidos   = document.querySelector("#partidos-list");
    const formPartido     = document.querySelector("#form-partido");
    const formJugador     = document.querySelector("#form-jugador");
    const selectMvp       = document.querySelector("#mvp");
    const searchPlayer    = document.querySelector("#search-player");
    const rankingCriterio = document.querySelector("#ranking-criterio");
    const rankingList     = document.querySelector("#ranking-list");
    const modal           = document.querySelector("#player-modal");
    const modalCloseBtn   = document.querySelector("#modal-close-btn");

    
    const formRendimiento     = document.querySelector("#form-rendimiento");
    const selectRendPartido   = document.querySelector("#rendimiento-partido");
    const selectRendJugador   = document.querySelector("#rendimiento-jugador");
    const rendimientoListEl   = document.querySelector("#rendimiento-list");

    
    const modalViewSection  = document.querySelector("#modal-view-mode");
    const modalEditSection  = document.querySelector("#modal-edit-mode");
    const modalEditToggle   = document.querySelector("#modal-edit-toggle");
    const modalEditCancel   = document.querySelector("#modal-edit-cancel");
    const modalEditForm     = document.querySelector("#modal-edit-mode");
    const modalDeleteButton = document.querySelector("#modal-delete-player");

    
    if (gridJugadores) renderizarJugadores(jugadores, gridJugadores);
    if (listaPartidos) renderizarPartidos(partidos, listaPartidos);
    actualizarEstadisticasPartidos(partidos);

    if (selectMvp) actualizarSelectMVP(selectMvp);
    if (rankingList && rankingCriterio) actualizarRanking(rankingCriterio, rankingList);

    
    if (selectRendPartido || selectRendJugador) {
        poblarSelectsRendimiento(selectRendPartido, selectRendJugador);
    }
    if (rendimientoListEl) {
        renderizarRendimientos(rendimientos, rendimientoListEl);
    }

    setupTabs();

  
    if (searchPlayer && gridJugadores) {
        searchPlayer.addEventListener("input", () => {
            const term = searchPlayer.value.trim().toLowerCase();

            if (!term) {
                renderizarJugadores(jugadores, gridJugadores);
                return;
            }

            const filtrados = jugadores.filter(j =>
                j.nombre.toLowerCase().includes(term) ||
                j.posicion.toLowerCase().includes(term) ||
                String(j.dorsal).includes(term)
            );

            renderizarJugadores(filtrados, gridJugadores);
        });
    }

  
    if (formJugador && gridJugadores) {
        formJugador.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombreInput      = document.querySelector("#jugador-nombre");
            const posicionInput    = document.querySelector("#jugador-posicion");
            const dorsalInput      = document.querySelector("#jugador-dorsal");
            const descripcionInput = document.querySelector("#jugador-descripcion");
            const fotoInput        = document.querySelector("#jugador-foto");
            const fotoFileInput    = document.querySelector("#jugador-foto-file");
            const golesInput       = document.querySelector("#jugador-goles");
            const asistInput       = document.querySelector("#jugador-asistencias");

            
            const nacimientoInput   = document.querySelector("#jugador-nacimiento");
            const nacionalidadInput = document.querySelector("#jugador-nacionalidad");
            const pieInput          = document.querySelector("#jugador-pie");
            const alturaInput       = document.querySelector("#jugador-altura");
            const pesoInput         = document.querySelector("#jugador-peso");
            const estadoInput       = document.querySelector("#jugador-estado"); 

            const nombre      = nombreInput.value.trim();
            const posicion    = posicionInput.value.trim();
            const dorsal      = Number(dorsalInput.value);
            const descripcion = descripcionInput.value.trim() || "Jugador del FC GameingTOP.";

            const goles       = Number(golesInput?.value || "0");
            const asistencias = Number(asistInput?.value || "0");

            const fechaNacimiento = nacimientoInput ? nacimientoInput.value : "";
            const nacionalidad    = nacionalidadInput ? nacionalidadInput.value.trim() : "";
            const pieDominante    = pieInput ? pieInput.value : "";
            const altura          = alturaInput ? Number(alturaInput.value) : NaN;
            const peso            = pesoInput ? Number(pesoInput.value) : NaN;
            const estadoBase      = estadoInput ? estadoInput.value : "Activo"; // NUEVO

          
            let foto = fotoInput.value.trim();
            if (fotoFileInput && fotoFileInput.files && fotoFileInput.files[0]) {
                const file = fotoFileInput.files[0];
                foto = URL.createObjectURL(file);
            } else if (!foto) {
                foto = "img/jugador1.jpg";
            }
            

            
            if (!nombre || !posicion || isNaN(dorsal) || dorsal <= 0) {
                alert("Por favor, completa nombre, posición y dorsal (mayor que 0).");
                return;
            }

           
            if (nacimientoInput && !fechaNacimiento) {
                alert("Por favor, indica la fecha de nacimiento del jugador.");
                return;
            }
            if (nacionalidadInput && !nacionalidad) {
                alert("Por favor, indica la nacionalidad del jugador.");
                return;
            }
            if (pieInput && !pieDominante) {
                alert("Por favor, selecciona el pie dominante del jugador.");
                return;
            }
            if (alturaInput && (isNaN(altura) || altura <= 0)) {
                alert("Por favor, indica una altura válida.");
                return;
            }
            if (pesoInput && (isNaN(peso) || peso <= 0)) {
                alert("Por favor, indica un peso válido.");
                return;
            }

            
            const jugadorConMismoDorsal = jugadores.find(j => j.dorsal === dorsal);
            if (jugadorConMismoDorsal) {
                alert(`El dorsal #${dorsal} ya está asignado a ${jugadorConMismoDorsal.nombre}. Elige otro número.`);
                return;
            }

            const nuevoJugador = {
                id: jugadores.length ? Math.max(...jugadores.map(j => j.id)) + 1 : 1,
                nombre,
                posicion,
                dorsal,
                descripcion,
                foto,
                goles: isNaN(goles) ? 0 : goles,
                asistencias: isNaN(asistencias) ? 0 : asistencias,
                // Guardamos también los nuevos campos
                fechaNacimiento: fechaNacimiento || null,
                nacionalidad: nacionalidad || null,
                pieDominante: pieDominante || null,
                altura: isNaN(altura) ? null : altura,
                peso: isNaN(peso) ? null : peso,
                estado: estadoBase // NUEVO
            };

            jugadores.push(nuevoJugador);

            // Actualizar grid de jugadores respetando filtro actual
            const term = searchPlayer ? searchPlayer.value.trim().toLowerCase() : "";
            if (term) {
                const filtrados = jugadores.filter(j =>
                    j.nombre.toLowerCase().includes(term) ||
                    j.posicion.toLowerCase().includes(term) ||
                    String(j.dorsal).includes(term)
                );
                renderizarJugadores(filtrados, gridJugadores);
            } else {
                renderizarJugadores(jugadores, gridJugadores);
            }

            // Actualizar selects relacionados
            if (selectMvp) actualizarSelectMVP(selectMvp);
            if (selectRendPartido || selectRendJugador) {
                poblarSelectsRendimiento(selectRendPartido, selectRendJugador);
            }
            if (rankingList && rankingCriterio) actualizarRanking(rankingCriterio, rankingList);

            formJugador.reset();
        });
    }

  
    if (formPartido && listaPartidos) {
        formPartido.addEventListener("submit", (e) => {
            e.preventDefault();

            const rivalInput      = document.querySelector("#rival");
            const fechaInput      = document.querySelector("#fecha");
            const horaInput       = document.querySelector("#hora");
            const estadioInput    = document.querySelector("#estadio");
            const golesLocalInput = document.querySelector("#golesLocal");
            const golesRivalInput = document.querySelector("#golesRival");
            const tipoSelect      = document.querySelector("#tipo");
            const mvpSelect       = document.querySelector("#mvp");

            const rival      = rivalInput.value.trim();
            const fecha      = fechaInput.value;
            const hora       = horaInput.value;
            const estadio    = estadioInput.value.trim();
            const golesLocal = Number(golesLocalInput.value || "0");
            const golesRival = Number(golesRivalInput.value || "0");
            const tipo       = tipoSelect.value;
            const mvpId      = mvpSelect && mvpSelect.value !== ""
                ? Number(mvpSelect.value)
                : null;

            if (!rival || !fecha) {
                alert("Por favor, llena al menos el rival y la fecha.");
                return;
            }

            const nuevoPartido = {
                id: partidos.length + 1,
                rival,
                fecha,
                hora,
                estadio,
                golesLocal: isNaN(golesLocal) ? 0 : golesLocal,
                golesRival: isNaN(golesRival) ? 0 : golesRival,
                tipo,
                mvpId
            };

            partidos.push(nuevoPartido);

            renderizarPartidos(partidos, listaPartidos);
            actualizarEstadisticasPartidos(partidos);
            if (rankingList && rankingCriterio) actualizarRanking(rankingCriterio, rankingList);

            // NUEVO: actualizar selects de rendimiento
            if (selectRendPartido || selectRendJugador) {
                poblarSelectsRendimiento(selectRendPartido, selectRendJugador);
            }

            formPartido.reset();
        });
    }


    if (formRendimiento && rendimientoListEl) {
        formRendimiento.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!selectRendPartido || !selectRendJugador) return;

            const partidoId  = Number(selectRendPartido.value);
            const jugadorId  = Number(selectRendJugador.value);

            const minInput        = document.querySelector("#rendimiento-minutos");
            const golesInput      = document.querySelector("#rendimiento-goles");
            const amarillasInput  = document.querySelector("#rendimiento-amarillas");
            const rojasInput      = document.querySelector("#rendimiento-rojas");

            const minutos    = Number(minInput?.value || "0");
            const goles      = Number(golesInput?.value || "0");
            const amarillas  = Number(amarillasInput?.value || "0");
            const rojas      = Number(rojasInput?.value || "0");

            const partido = partidos.find(p => p.id === partidoId);
            const jugador = jugadores.find(j => j.id === jugadorId);

            
            if (!partido) {
                alert("El partido seleccionado no existe.");
                return;
            }
            if (!jugador) {
                alert("El jugador seleccionado no existe.");
                return;
            }
            if (minutos < 0 || minutos > 120) {
                alert("Los minutos deben estar entre 0 y 120.");
                return;
            }
            if (amarillas < 0 || amarillas > 2) {
                alert("Las tarjetas amarillas deben estar entre 0 y 2.");
                return;
            }
            if (rojas < 0 || rojas > 1) {
                alert("Las tarjetas rojas deben estar entre 0 y 1.");
                return;
            }

            const nuevoRend = {
                id: rendimientos.length ? Math.max(...rendimientos.map(r => r.id || 0)) + 1 : 1,
                partidoId,
                jugadorId,
                minutos: isNaN(minutos) ? 0 : minutos,
                goles: isNaN(goles) ? 0 : goles,
                amarillas: isNaN(amarillas) ? 0 : amarillas,
                rojas: isNaN(rojas) ? 0 : rojas
            };

            rendimientos.push(nuevoRend);

            renderizarRendimientos(rendimientos, rendimientoListEl);

            
            if (rankingList && rankingCriterio) {
                actualizarRanking(rankingCriterio, rankingList);
            }

            formRendimiento.reset();
        });
    }

    
    if (listaPartidos) {
        listaPartidos.addEventListener("click", (e) => {
            const btn = e.target.closest("button[data-action]");
            if (!btn) return;

            const id = Number(btn.dataset.id);
            const action = btn.dataset.action;
            const partido = partidos.find(p => p.id === id);
            if (!partido) return;

            if (action === "delete") {
                const confirmar = confirm(`¿Eliminar el partido contra ${partido.rival}?`);
                if (!confirmar) return;

                const index = partidos.findIndex(p => p.id === id);
                if (index !== -1) {
                    partidos.splice(index, 1);

                    /partido
                    rendimientos = rendimientos.filter(r => r.partidoId !== id);
                    if (rendimientoListEl) {
                        renderizarRendimientos(rendimientos, rendimientoListEl);
                    }

                    renderizarPartidos(partidos, listaPartidos);
                    actualizarEstadisticasPartidos(partidos);
                    if (rankingList && rankingCriterio) actualizarRanking(rankingCriterio, rankingList);

                    // actualizar selects de rendimiento
                    if (selectRendPartido || selectRendJugador) {
                        poblarSelectsRendimiento(selectRendPartido, selectRendJugador);
                    }
                }
            } else if (action === "details") {
                mostrarDetallesPartido(partido);
            }
        });
    }

   
    if (gridJugadores && modal) {
        gridJugadores.addEventListener("click", (e) => {
            // 1) ¿Se hizo clic en el botón de eliminar?
            const deleteBtn = e.target.closest("button[data-action='delete-player']");
            if (deleteBtn) {
                const id = Number(deleteBtn.dataset.id);
                const jugador = jugadores.find(j => j.id === id);
                if (!jugador) return;

                const confirmar = confirm(`¿Eliminar a ${jugador.nombre} del equipo?`);
                if (!confirmar) return;

                // Borrar del array de jugadores
                jugadores = jugadores.filter(j => j.id !== id);

                 jugador
                partidos.forEach(p => {
                    if (p.mvpId === id) {
                        p.mvpId = null;
                    }
                });

                jugador
                rendimientos = rendimientos.filter(r => r.jugadorId !== id);
                if (rendimientoListEl) {
                    renderizarRendimientos(rendimientos, rendimientoListEl);
                }

              
                const term = searchPlayer ? searchPlayer.value.trim().toLowerCase() : "";
                if (term) {
                    const filtrados = jugadores.filter(j =>
                        j.nombre.toLowerCase().includes(term) ||
                        j.posicion.toLowerCase().includes(term) ||
                        String(j.dorsal).includes(term)
                    );
                    renderizarJugadores(filtrados, gridJugadores);
                } else {
                    renderizarJugadores(jugadores, gridJugadores);
                }

              
                if (listaPartidos) {
                    renderizarPartidos(partidos, listaPartidos);
                    actualizarEstadisticasPartidos(partidos);
                }
                if (selectMvp) actualizarSelectMVP(selectMvp);
                if (selectRendPartido || selectRendJugador) {
                    poblarSelectsRendimiento(selectRendPartido, selectRendJugador);
                }
                if (rankingList && rankingCriterio) actualizarRanking(rankingCriterio, rankingList);

              
                if (jugadorActual && jugadorActual.id === id) {
                    cerrarModalJugador();
                }
                return;
            }

            // 2) Si no fue clic en borrar, abrimos el modal normal
            const card = e.target.closest(".player-card");
            if (!card) return;
            const id = Number(card.dataset.id);
            abrirModalJugador(id);
        });
    }

  
    if (rankingList && modal) {
        rankingList.addEventListener("click", (e) => {
            const card = e.target.closest(".ranking-card");
            if (!card) return;
            const id = Number(card.dataset.id);
            abrirModalJugador(id);
        });
    }

    
    if (rankingCriterio && rankingList) {
        rankingCriterio.addEventListener("change", () => {
            actualizarRanking(rankingCriterio, rankingList);
        });
    }

    // ======================
    //  MODAL: CERRAR (X, backdrop, ESC)
    // ======================
    if (modal && modalCloseBtn) {
        modalCloseBtn.addEventListener("click", cerrarModalJugador);
        const backdrop = modal.querySelector(".modal-backdrop");
        if (backdrop) {
            backdrop.addEventListener("click", cerrarModalJugador);
        }
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") cerrarModalJugador();
        });
    }

    // ======================
    //  MODAL: MODO EDICIÓN
    // ======================
    function mostrarModoVista() {
        if (!modalViewSection || !modalEditSection) return;
        modalViewSection.classList.remove("hidden");
        modalEditSection.classList.add("hidden");
    }

    function mostrarModoEdicion() {
        if (!jugadorActual || !modalViewSection || !modalEditSection) return;

        // Rellenar campos de edición con datos actuales
        const nombreInput      = document.querySelector("#modal-edit-nombre");
        const posicionInput    = document.querySelector("#modal-edit-posicion");
        const dorsalInput      = document.querySelector("#modal-edit-dorsal");
        const descripcionInput = document.querySelector("#modal-edit-descripcion");
        const fotoUrlInput     = document.querySelector("#modal-edit-foto-url");
        const golesInput       = document.querySelector("#modal-edit-goles");
        const asistInput       = document.querySelector("#modal-edit-asistencias");
        const previewImg       = document.querySelector("#modal-edit-photo-preview");

        if (nombreInput)      nombreInput.value      = jugadorActual.nombre;
        if (posicionInput)    posicionInput.value    = jugadorActual.posicion;
        if (dorsalInput)      dorsalInput.value      = jugadorActual.dorsal;
        if (descripcionInput) descripcionInput.value = jugadorActual.descripcion;
        if (fotoUrlInput)     fotoUrlInput.value     = jugadorActual.foto;
        if (golesInput)       golesInput.value       = jugadorActual.goles || 0;
        if (asistInput)       asistInput.value       = jugadorActual.asistencias || 0;
        if (previewImg) {
            previewImg.src = jugadorActual.foto;
            previewImg.alt = jugadorActual.nombre;
        }

        // 🔹 CAMPOS NUEVOS EN MODO EDICIÓN
        const editNacimiento   = document.querySelector("#modal-edit-nacimiento");
        const editNacionalidad = document.querySelector("#modal-edit-nacionalidad");
        const editPie          = document.querySelector("#modal-edit-pie");
        const editAltura       = document.querySelector("#modal-edit-altura");
        const editPeso         = document.querySelector("#modal-edit-peso");
        const editEstado       = document.querySelector("#modal-edit-estado"); // NUEVO

        if (editNacimiento)   editNacimiento.value   = jugadorActual.fechaNacimiento || "";
        if (editNacionalidad) editNacionalidad.value = jugadorActual.nacionalidad    || "";
        if (editPie)          editPie.value          = jugadorActual.pieDominante    || "";
        if (editAltura)       editAltura.value       = jugadorActual.altura          || "";
        if (editPeso)         editPeso.value         = jugadorActual.peso            || "";
        if (editEstado)       editEstado.value       = jugadorActual.estado || "Activo";

        modalViewSection.classList.add("hidden");
        modalEditSection.classList.remove("hidden");
    }

    if (modalEditToggle) {
        modalEditToggle.addEventListener("click", () => {
            if (!jugadorActual) return;
            mostrarModoEdicion();
        });
    }

    if (modalEditCancel) {
        modalEditCancel.addEventListener("click", () => {
            mostrarModoVista();
            if (jugadorActual) {
                // refrescamos vista con datos actuales
                abrirModalJugador(jugadorActual.id);
            }
        });
    }

    if (modalEditForm) {
        modalEditForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!jugadorActual) return;

            const nombreInput      = document.querySelector("#modal-edit-nombre");
            const posicionInput    = document.querySelector("#modal-edit-posicion");
            const dorsalInput      = document.querySelector("#modal-edit-dorsal");
            const descripcionInput = document.querySelector("#modal-edit-descripcion");
            const fotoUrlInput     = document.querySelector("#modal-edit-foto-url");
            const fotoFileInput    = document.querySelector("#modal-edit-foto-file");
            const golesInput       = document.querySelector("#modal-edit-goles");
            const asistInput       = document.querySelector("#modal-edit-asistencias");

            // 🔹 NUEVOS CAMPOS DEL MODAL DE EDICIÓN
            const editNacimiento   = document.querySelector("#modal-edit-nacimiento");
            const editNacionalidad = document.querySelector("#modal-edit-nacionalidad");
            const editPie          = document.querySelector("#modal-edit-pie");
            const editAltura       = document.querySelector("#modal-edit-altura");
            const editPeso         = document.querySelector("#modal-edit-peso");
            const editEstado       = document.querySelector("#modal-edit-estado"); // NUEVO

            const nuevoNombre      = nombreInput.value.trim();
            const nuevaPosicion    = posicionInput.value.trim();
            const nuevoDorsal      = Number(dorsalInput.value);
            const nuevaDescripcion = descripcionInput.value.trim() || "Jugador del FC GameingTOP.";
            const nuevaFotoURL     = fotoUrlInput.value.trim();
            const nuevosGoles      = Number(golesInput.value || "0");
            const nuevasAsist      = Number(asistInput.value || "0");

            let nuevaFoto = nuevaFotoURL || jugadorActual.foto;
            if (fotoFileInput && fotoFileInput.files && fotoFileInput.files[0]) {
                nuevaFoto = URL.createObjectURL(fotoFileInput.files[0]);
            }

            if (!nuevoNombre || !nuevaPosicion || isNaN(nuevoDorsal) || nuevoDorsal <= 0) {
                alert("Por favor, completa nombre, posición y dorsal (mayor que 0).");
                return;
            }

            // Validar dorsal único también al editar
            const otroConMismoDorsal = jugadores.find(
                j => j.dorsal === nuevoDorsal && j.id !== jugadorActual.id
            );
            if (otroConMismoDorsal) {
                alert(`El dorsal #${nuevoDorsal} ya está asignado a ${otroConMismoDorsal.nombre}. Elige otro número.`);
                return;
            }

            // Leer nuevos campos
            const nuevaFechaNacimiento = editNacimiento ? editNacimiento.value : jugadorActual.fechaNacimiento || "";
            const nuevaNacionalidad    = editNacionalidad ? editNacionalidad.value.trim() : (jugadorActual.nacionalidad || "");
            const nuevoPieDominante    = editPie ? editPie.value : (jugadorActual.pieDominante || "");
            const nuevaAlturaNum       = editAltura ? Number(editAltura.value) : jugadorActual.altura;
            const nuevoPesoNum         = editPeso ? Number(editPeso.value) : jugadorActual.peso;
            const nuevoEstadoBase      = editEstado ? editEstado.value : (jugadorActual.estado || "Activo"); // NUEVO

            // Actualizar objeto jugador
            jugadorActual.nombre      = nuevoNombre;
            jugadorActual.posicion    = nuevaPosicion;
            jugadorActual.dorsal      = nuevoDorsal;
            jugadorActual.descripcion = nuevaDescripcion;
            jugadorActual.foto        = nuevaFoto;
            jugadorActual.goles       = isNaN(nuevosGoles) ? 0 : nuevosGoles;
            jugadorActual.asistencias = isNaN(nuevasAsist) ? 0 : nuevasAsist;

            // Actualizar campos extra
            jugadorActual.fechaNacimiento = nuevaFechaNacimiento || null;
            jugadorActual.nacionalidad    = nuevaNacionalidad    || null;
            jugadorActual.pieDominante    = nuevoPieDominante    || null;
            jugadorActual.altura          = isNaN(nuevaAlturaNum) ? null : nuevaAlturaNum;
            jugadorActual.peso            = isNaN(nuevoPesoNum)   ? null : nuevoPesoNum;
            jugadorActual.estado          = nuevoEstadoBase; // NUEVO

            // También actualizamos el array "jugadores"
            const idx = jugadores.findIndex(j => j.id === jugadorActual.id);
            if (idx !== -1) jugadores[idx] = jugadorActual;

            // Re-render
            const term = searchPlayer ? searchPlayer.value.trim().toLowerCase() : "";
            if (term) {
                const filtrados = jugadores.filter(j =>
                    j.nombre.toLowerCase().includes(term) ||
                    j.posicion.toLowerCase().includes(term) ||
                    String(j.dorsal).includes(term)
                );
                renderizarJugadores(filtrados, gridJugadores);
            } else {
                renderizarJugadores(jugadores, gridJugadores);
            }

            if (selectMvp) actualizarSelectMVP(selectMvp);
            if (selectRendPartido || selectRendJugador) {
                poblarSelectsRendimiento(selectRendPartido, selectRendJugador);
            }
            if (rankingList && rankingCriterio) actualizarRanking(rankingCriterio, rankingList);

            // Volver a modo vista
            abrirModalJugador(jugadorActual.id);
            mostrarModoVista();
        });
    }

    if (modalDeleteButton) {
        modalDeleteButton.addEventListener("click", () => {
            if (!jugadorActual) return;

            const confirmar = confirm(`¿Eliminar a ${jugadorActual.nombre} del equipo?`);
            if (!confirmar) return;

            const id = jugadorActual.id;

            jugadores = jugadores.filter(j => j.id !== id);
            partidos.forEach(p => {
                if (p.mvpId === id) p.mvpId = null;
            });

            // NUEVO: eliminar rendimientos del jugador
            rendimientos = rendimientos.filter(r => r.jugadorId !== id);
            if (rendimientoListEl) {
                renderizarRendimientos(rendimientos, rendimientoListEl);
            }

            // Re-render jugadores y actualizar todo
            const term = searchPlayer ? searchPlayer.value.trim().toLowerCase() : "";
            if (term) {
                const filtrados = jugadores.filter(j =>
                    j.nombre.toLowerCase().includes(term) ||
                    j.posicion.toLowerCase().includes(term) ||
                    String(j.dorsal).includes(term)
                );
                renderizarJugadores(filtrados, gridJugadores);
            } else {
                renderizarJugadores(jugadores, gridJugadores);
            }

            if (listaPartidos) {
                renderizarPartidos(partidos, listaPartidos);
                actualizarEstadisticasPartidos(partidos);
            }
            if (selectMvp) actualizarSelectMVP(selectMvp);
            if (selectRendPartido || selectRendJugador) {
                poblarSelectsRendimiento(selectRendPartido, selectRendJugador);
            }
            if (rankingList && rankingCriterio) actualizarRanking(rankingCriterio, rankingList);

            cerrarModalJugador();
        });
    }
});

// ==========================
//  PESTAÑAS
// ==========================

function setupTabs() {
    const tabButtons  = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    if (!tabButtons.length || !tabContents.length) return;

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-tab");

            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            tabContents.forEach(content => {
                content.id === `tab-${target}`
                    ? content.classList.add("active")
                    : content.classList.remove("active");
            });
        });
    });
}

// ==========================
//  RENDER JUGADORES
// ==========================

function renderizarJugadores(listaJugadores, contenedor) {
    contenedor.innerHTML = "";

    if (!listaJugadores.length) {
        contenedor.innerHTML = "<p>No hay jugadores para mostrar.</p>";
        return;
    }

    listaJugadores.forEach(jugador => {
        const card = document.createElement("article");
        card.classList.add("player-card");
        card.dataset.id = jugador.id;

        const photoDiv = document.createElement("div");
        photoDiv.classList.add("player-photo");
        const img = document.createElement("img");
        img.src = jugador.foto;
        img.alt = jugador.nombre;
        photoDiv.appendChild(img);

        const dataDiv = document.createElement("div");
        dataDiv.classList.add("player-data");

        const nombre = document.createElement("h3");
        nombre.textContent = jugador.nombre;

        const posicion = document.createElement("p");
        posicion.classList.add("position");
        posicion.textContent = jugador.posicion;

        const numero = document.createElement("p");
        numero.classList.add("number");
        numero.textContent = `#${jugador.dorsal}`;

        const extra = document.createElement("p");
        extra.classList.add("extra");
        extra.textContent = jugador.descripcion;

        dataDiv.appendChild(nombre);
        dataDiv.appendChild(posicion);
        dataDiv.appendChild(numero);
        dataDiv.appendChild(extra);

        // NUEVO: mini resumen de minutos y estado
        try {
            const resumen = calcularMinutosYEstadoJugador(jugador.id);
            const meta = document.createElement("p");
            meta.classList.add("player-meta");
            meta.textContent = `${resumen.minutos} min · ${resumen.estadoFinal}`;
            dataDiv.appendChild(meta);
        } catch {
            // si aún no está definida la función o falla, no rompe nada
        }

        // Footer con botón de eliminar
        const footer = document.createElement("div");
        footer.classList.add("player-footer");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn-danger", "btn-small");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.setAttribute("data-action", "delete-player");
        deleteBtn.setAttribute("data-id", jugador.id);

        footer.appendChild(deleteBtn);

        card.appendChild(photoDiv);
        card.appendChild(dataDiv);
        card.appendChild(footer);

        contenedor.appendChild(card);
    });
}

// ==========================
//  RENDER PARTIDOS
// ==========================

function renderizarPartidos(lista, contenedor) {
    contenedor.innerHTML = "";

    if (!lista.length) {
        contenedor.innerHTML = "<p>No hay partidos registrados todavía.</p>";
        return;
    }

    lista.forEach(p => {
        const card = document.createElement("article");
        card.classList.add("match-card");

        const tieneMarcador =
            typeof p.golesLocal === "number" &&
            typeof p.golesRival === "number";

        const estado = tieneMarcador ? "Jugado" : "Programado";
        const fechaTexto   = p.fecha   || "Por definir";
        const horaTexto    = p.hora    || "Por definir";
        const estadioTexto = p.estadio || "Por definir";

        const mvpJugador = typeof p.mvpId === "number"
            ? jugadores.find(j => j.id === p.mvpId)
            : null;

        const mvpHtml = mvpJugador
            ? `<p class="match-mvp">⭐ MVP: ${mvpJugador.nombre}</p>`
            : "";

        card.innerHTML = `
            <div class="match-header">
                <div>
                    <h3 class="match-teams">
                        SIGMOTOA FC <span>vs</span> ${p.rival}
                    </h3>
                    <p class="match-type">${p.tipo}</p>
                </div>
                <div class="match-status match-status--${estado === "Jugado" ? "played" : "scheduled"}">
                    ${estado}
                </div>
            </div>

            <div class="match-body">
                <div class="match-info">
                    <p>📅 ${fechaTexto}</p>
                    <p>⏰ ${horaTexto}</p>
                    <p>📍 ${estadioTexto}</p>
                    ${mvpHtml}
                </div>
                <div class="match-score-box">
                    <span class="team-name">Local</span>
                    <span class="score">
                        ${tieneMarcador ? `${p.golesLocal} - ${p.golesRival}` : "—"}
                    </span>
                    <span class="team-name">Rival</span>
                </div>
            </div>

            <div class="match-footer">
                <button class="btn-ghost btn-small" data-id="${p.id}" data-action="details">
                    Detalles
                </button>
                <button class="btn-danger btn-small" data-id="${p.id}" data-action="delete">
                    Eliminar
                </button>
            </div>
        `;

        contenedor.appendChild(card);
    });
}

// ==========================
//  ESTADÍSTICAS GLOBAL PARTIDOS
// ==========================

function actualizarEstadisticasPartidos(lista) {
    const playedEl   = document.getElementById("stat-played");
    const winsEl     = document.getElementById("stat-wins");
    const drawsEl    = document.getElementById("stat-draws");
    const lossesEl   = document.getElementById("stat-losses");
    const gfEl       = document.getElementById("stat-gf");
    const gaEl       = document.getElementById("stat-ga");
    const winrateEl  = document.getElementById("stat-winrate");

    if (!playedEl) return;

    let jugados = 0;
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let gf = 0;
    let ga = 0;

    lista.forEach(p => {
        const gl = Number(p.golesLocal);
        const gr = Number(p.golesRival);

        if (isNaN(gl) || isNaN(gr)) return;

        jugados++;
        gf += gl;
        ga += gr;

        if (gl > gr) wins++;
        else if (gl < gr) losses++;
        else draws++;
    });

    const winRate = jugados > 0 ? Math.round((wins / jugados) * 100) : 0;

    playedEl.textContent  = jugados;
    winsEl.textContent    = wins;
    drawsEl.textContent   = draws;
    lossesEl.textContent  = losses;
    gfEl.textContent      = gf;
    gaEl.textContent      = ga;
    winrateEl.textContent = `${winRate}%`;
}

// ==========================
//  SELECT MVP
// ==========================

function actualizarSelectMVP(selectElement) {
    selectElement.innerHTML = '<option value="">-- Sin asignar --</option>';

    jugadores.forEach(j => {
        const opt = document.createElement("option");
        opt.value = j.id;
        opt.textContent = `${j.nombre} (#${j.dorsal})`;
        selectElement.appendChild(opt);
    });
}

// ==========================
//  SELECTS RENDIMIENTO (NUEVO)
// ==========================

function poblarSelectsRendimiento(selectPartidoEl, selectJugadorEl) {
    if (selectPartidoEl) {
        selectPartidoEl.innerHTML = "";
        partidos.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = `#${p.id} · vs ${p.rival} (${p.fecha || "sin fecha"})`;
            selectPartidoEl.appendChild(opt);
        });
    }

    if (selectJugadorEl) {
        selectJugadorEl.innerHTML = "";
        jugadores.forEach(j => {
            const opt = document.createElement("option");
            opt.value = j.id;
            opt.textContent = `${j.nombre} (#${j.dorsal})`;
            selectJugadorEl.appendChild(opt);
        });
    }
}

// ==========================
//  LISTA RENDIMIENTOS (NUEVO)
// ==========================

function renderizarRendimientos(lista, contenedor) {
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (!lista || !lista.length) {
        contenedor.innerHTML = "<p>No hay rendimientos registrados todavía.</p>";
        return;
    }

    lista.forEach(r => {
        const jugador = jugadores.find(j => j.id === r.jugadorId);
        const partido = partidos.find(p => p.id === r.partidoId);

        const card = document.createElement("article");
        card.classList.add("performance-card");

        const jugadorNombre = jugador ? jugador.nombre : "Jugador eliminado";
        const partidoTexto = partido
            ? `vs ${partido.rival} (${partido.fecha || ""})`
            : "Partido eliminado";

        card.innerHTML = `
            <div class="performance-header">
                <h4>${jugadorNombre}</h4>
                <div class="performance-match">${partidoTexto}</div>
            </div>
            <div class="performance-body">
                <p>⏱️ Minutos: <strong>${r.minutos}</strong></p>
                <p>⚽ Goles: <strong>${r.goles}</strong></p>
                <p>🟨 Amarillas: <strong>${r.amarillas}</strong></p>
                <p>🟥 Rojas: <strong>${r.rojas}</strong></p>
            </div>
        `;

        contenedor.appendChild(card);
    });
}

// ==========================
//  DETALLES PARTIDO (alert)
// ==========================

function mostrarDetallesPartido(partido) {
    const tieneMarcador =
        typeof partido.golesLocal === "number" &&
        typeof partido.golesRival === "number";

    const mvpJugador = typeof partido.mvpId === "number"
        ? jugadores.find(j => j.id === partido.mvpId)
        : null;

    const mvpLinea = mvpJugador ? `MVP: ${mvpJugador.nombre}\n` : "";

    alert(
        `Partido: FC GameingTOP vs ${partido.rival}\n` +
        `Tipo: ${partido.tipo}\n` +
        `Fecha: ${partido.fecha || "Por definir"}\n` +
        `Hora: ${partido.hora || "Por definir"}\n` +
        `Estadio: ${partido.estadio || "Por definir"}\n` +
        mvpLinea +
        `Marcador: ${
            tieneMarcador
                ? `${partido.golesLocal} - ${partido.golesRival}`
                : "Por definir"
        }`
    );
}

// ==========================
//  STATS JUGADORES (RANKING)
// ==========================

function calcularStatsJugadores() {
    const stats = {};

    jugadores.forEach(j => {
        stats[j.id] = {
            mvps: 0,
            partidos: 0,
            goles: j.goles || 0,
            asistencias: j.asistencias || 0,
            minutos: 0,    // NUEVO
            amarillas: 0,  // NUEVO
            rojas: 0       // NUEVO
        };
    });

    partidos.forEach(p => {
        if (typeof p.mvpId === "number" && stats[p.mvpId]) {
            stats[p.mvpId].mvps += 1;
            stats[p.mvpId].partidos += 1; // partidos destacados
        }
    });

    // NUEVO: sumar minutos, goles y tarjetas desde rendimientos
    if (Array.isArray(rendimientos)) {
        rendimientos.forEach(r => {
            const st = stats[r.jugadorId];
            if (!st) return;

            st.minutos   += Number(r.minutos)   || 0;
            st.goles     += Number(r.goles)     || 0;
            st.amarillas += Number(r.amarillas) || 0;
            st.rojas     += Number(r.rojas)     || 0;
        });
    }

    return stats;
}

// NUEVO: minutos y estado final del jugador
function calcularMinutosYEstadoJugador(idJugador) {
    const stats = calcularStatsJugadores();
    const st = stats[idJugador] || { minutos: 0, amarillas: 0, rojas: 0 };

    const jugador = jugadores.find(j => j.id === idJugador);
    const estadoBase = jugador?.estado || "Activo";
    let estadoFinal = estadoBase;

    if (st.rojas >= 1) {
        estadoFinal = "Suspendido (roja)";
    } else if (st.amarillas >= 2) {
        estadoFinal = "Suspendido (2 amarillas)";
    }

    return {
        minutos: st.minutos || 0,
        estadoFinal,
        amarillas: st.amarillas || 0,
        rojas: st.rojas || 0,
        estadoBase
    };
}

function actualizarRanking(selectCriterioEl, rankingListEl) {
    const criterio = selectCriterioEl.value || "mvp";
    const stats = calcularStatsJugadores();

    const data = jugadores.map(j => {
        const st = stats[j.id] || { mvps: 0, partidos: 0, goles: 0, asistencias: 0 };
        return { jugador: j, stats: st };
    });

    data.sort((a, b) => {
        if (criterio === "mvp") {
            return b.stats.mvps - a.stats.mvps || a.jugador.nombre.localeCompare(b.jugador.nombre);
        } else if (criterio === "partidos") {
            return b.stats.partidos - a.stats.partidos || a.jugador.nombre.localeCompare(b.jugador.nombre);
        } else if (criterio === "goles") {
            return b.stats.goles - a.stats.goles || a.jugador.nombre.localeCompare(b.jugador.nombre);
        } else if (criterio === "asistencias") {
            return b.stats.asistencias - a.stats.asistencias || a.jugador.nombre.localeCompare(b.jugador.nombre);
        }
        return 0;
    });

    renderizarRanking(data, rankingListEl);
}

function renderizarRanking(lista, contenedor) {
    contenedor.innerHTML = "";

    if (!lista.length) {
        contenedor.innerHTML = "<p>No hay jugadores para mostrar en el ranking.</p>";
        return;
    }

    lista.forEach((item, index) => {
        const { jugador, stats } = item;

        const card = document.createElement("article");
        card.classList.add("ranking-card");
        card.dataset.id = jugador.id;

        card.innerHTML = `
            <div class="ranking-position ranking-pos-${index + 1}">#${index + 1}</div>
            <div class="ranking-player">
                <img src="${jugador.foto}" alt="${jugador.nombre}" class="ranking-avatar" />
                <div class="ranking-player-info">
                    <h3>${jugador.nombre}</h3>
                    <p>${jugador.posicion} · #${jugador.dorsal}</p>
                </div>
            </div>
            <div class="ranking-stats">
                <p>MVPs: <strong>${stats.mvps}</strong></p>
                <p>Partidos destacados: <strong>${stats.partidos}</strong></p>
                <p>Goles: <strong>${stats.goles}</strong></p>
                <p>Asistencias: <strong>${stats.asistencias}</strong></p>
            </div>
        `;

        contenedor.appendChild(card);
    });
}

// ==========================
//  MODAL JUGADOR
// ==========================

function abrirModalJugador(idJugador) {
    const jugador = jugadores.find(j => j.id === idJugador);
    if (!jugador) return;

    jugadorActual = jugador; // guardamos referencia global

    const modal = document.querySelector("#player-modal");
    if (!modal) return;

    const stats = calcularStatsJugadores()[idJugador] || { mvps: 0, partidos: 0, goles: 0, asistencias: 0 };

    const photoEl    = document.querySelector("#modal-player-photo");
    const nameEl     = document.querySelector("#modal-player-name");
    const posEl      = document.querySelector("#modal-player-position");
    const numEl      = document.querySelector("#modal-player-number");
    const descEl     = document.querySelector("#modal-player-description");
    const matchEl    = document.querySelector("#modal-player-matches");
    const mvpsEl     = document.querySelector("#modal-player-mvps");
    const goalsEl    = document.querySelector("#modal-player-goals");
    const assistsEl  = document.querySelector("#modal-player-assists");
    const minutesEl  = document.querySelector("#modal-player-minutes"); // NUEVO
    const statusEl   = document.querySelector("#modal-player-status");  // NUEVO

    if (photoEl) { photoEl.src = jugador.foto; photoEl.alt = jugador.nombre; }
    if (nameEl)  nameEl.textContent = jugador.nombre;
    if (posEl)   posEl.textContent = jugador.posicion;
    if (numEl)   numEl.textContent = `Dorsal #${jugador.dorsal}`;
    if (descEl)  descEl.textContent = jugador.descripcion;

    // NUEVOS CAMPOS EN MODO VISTA (modal)
    const nacEl   = document.querySelector("#modal-player-nacimiento");
    const nac2El  = document.querySelector("#modal-player-nacionalidad");
    const pieEl   = document.querySelector("#modal-player-pie");
    const altEl   = document.querySelector("#modal-player-altura");
    const pesEl   = document.querySelector("#modal-player-peso");

    if (nacEl)   nacEl.textContent  = jugador.fechaNacimiento || "—";
    if (nac2El)  nac2El.textContent = jugador.nacionalidad    || "—";
    if (pieEl)   pieEl.textContent  = jugador.pieDominante    || "—";
    if (altEl)   altEl.textContent  = jugador.altura ? jugador.altura + " cm" : "—";
    if (pesEl)   pesEl.textContent  = jugador.peso   ? jugador.peso   + " kg" : "—";

    if (matchEl)   matchEl.textContent   = stats.partidos;
    if (mvpsEl)    mvpsEl.textContent    = stats.mvps;
    if (goalsEl)   goalsEl.textContent   = jugador.goles || 0;
    if (assistsEl) assistsEl.textContent = jugador.asistencias || 0;

    // NUEVO: minutos + estado final
    const resumenEstado = calcularMinutosYEstadoJugador(idJugador);
    if (minutesEl) minutesEl.textContent = resumenEstado.minutos || 0;
    if (statusEl)  statusEl.textContent  = resumenEstado.estadoFinal;

    // Por si estaba en modo edición, aseguramos modo vista
    const modalViewSection = document.querySelector("#modal-view-mode");
    const modalEditSection = document.querySelector("#modal-edit-mode");
    if (modalViewSection && modalEditSection) {
        modalViewSection.classList.remove("hidden");
        modalEditSection.classList.add("hidden");
    }

    modal.classList.remove("hidden");
}

function cerrarModalJugador() {
    const modal = document.querySelector("#player-modal");
    if (!modal) return;
    modal.classList.add("hidden");
}
