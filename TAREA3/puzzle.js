// =============================
// OBJETO PRINCIPAL DEL JUEGO
// =============================
const PUZZLE = {
    ORDEN_INICIAL: ["1","2","3","4","5","6","7","8","empty"],
    ordenActual: [],
    movimientos: 0,
    tiempo: 0,
    temporizador: null,
    mejorTiempo: localStorage.getItem("mejorTiempo") || null,
};

// =============================
// ELEMENTOS DEL DOM
// =============================
const BOTON_INICIO = document.getElementById("btn-inicio");
const BOTON_GUARDAR = document.getElementById("btn-guardar");
const BOTON_CARGAR = document.getElementById("btn-cargar");
const TABLA = document.getElementById("puzzle");
const SPAN_MOV = document.getElementById("movimientos");
const SPAN_TIEMPO = document.getElementById("tiempo");
const SPAN_MEJOR = document.getElementById("mejor-tiempo");
const MENSAJE = document.getElementById("mensaje");

// =============================
// FUNCIONES AUXILIARES
// =============================

// Mezclar array
function mezclarArray(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

// Dibujar el puzzle en pantalla
function dibujarPuzzle() {
    const celdas = TABLA.getElementsByTagName("td");
    for (let i = 0; i < celdas.length; i++) {
        let idCelda = PUZZLE.ordenActual[i];
        celdas[i].innerHTML = idCelda !== "empty" ? `<img src="${idCelda}.png">` : "";
        celdas[i].className = (idCelda === "empty") ? "vacio" : "";
    }
}

// Comprobar si se ha completado el puzzle
function verificarGanador() {
    if (PUZZLE.ordenActual.join() === PUZZLE.ORDEN_INICIAL.join()) {
        clearInterval(PUZZLE.temporizador);
        MENSAJE.textContent = `🎉 ¡Completado en ${PUZZLE.movimientos} movimientos y ${formatearTiempo(PUZZLE.tiempo)}!`;

        // Guardar mejor tiempo
        if (!PUZZLE.mejorTiempo || PUZZLE.tiempo < PUZZLE.mejorTiempo) {
            localStorage.setItem("mejorTiempo", PUZZLE.tiempo);
            PUZZLE.mejorTiempo = PUZZLE.tiempo;
            SPAN_MEJOR.textContent = formatearTiempo(PUZZLE.tiempo);
        }
    }
}

// Formatear segundos a mm:ss
function formatearTiempo(segundos) {
    const min = String(Math.floor(segundos / 60)).padStart(2, "0");
    const sec = String(segundos % 60).padStart(2, "0");
    return `${min}:${sec}`;
}

// =============================
// FUNCIONES PRINCIPALES
// =============================

// Iniciar juego
function iniciarJuego() {
    PUZZLE.ordenActual = mezclarArray([...PUZZLE.ORDEN_INICIAL]);
    PUZZLE.movimientos = 0;
    PUZZLE.tiempo = 0;
    MENSAJE.textContent = "";
    SPAN_MOV.textContent = "0";
    clearInterval(PUZZLE.temporizador);
    PUZZLE.temporizador = setInterval(() => {
        PUZZLE.tiempo++;
        SPAN_TIEMPO.textContent = formatearTiempo(PUZZLE.tiempo);
    }, 1000);
    dibujarPuzzle();
}

// Mover pieza si es vecina del espacio vacío
function moverPieza(id) {
    const pos = PUZZLE.ordenActual.indexOf(id);
    const vacio = PUZZLE.ordenActual.indexOf("empty");

    const filas = 3;
    const colPieza = pos % filas;
    const colVacio = vacio % filas;
    const filaPieza = Math.floor(pos / filas);
    const filaVacio = Math.floor(vacio / filas);

    const esVecino = (Math.abs(filaPieza - filaVacio) + Math.abs(colPieza - colVacio)) === 1;

    if (esVecino) {
        [PUZZLE.ordenActual[pos], PUZZLE.ordenActual[vacio]] = [PUZZLE.ordenActual[vacio], PUZZLE.ordenActual[pos]];
        PUZZLE.movimientos++;
        SPAN_MOV.textContent = PUZZLE.movimientos;
        dibujarPuzzle();
        verificarGanador();
    }
}

// Guardar partida
function guardarPartida() {
    const estado = {
        ordenActual: PUZZLE.ordenActual,
        movimientos: PUZZLE.movimientos,
        tiempo: PUZZLE.tiempo
    };
    localStorage.setItem("partidaGuardada", JSON.stringify(estado));
    MENSAJE.textContent = "💾 Partida guardada correctamente.";
}

// Cargar partida
function cargarPartida() {
    const guardado = localStorage.getItem("partidaGuardada");
    if (guardado) {
        const datos = JSON.parse(guardado);
        PUZZLE.ordenActual = datos.ordenActual;
        PUZZLE.movimientos = datos.movimientos;
        PUZZLE.tiempo = datos.tiempo;
        SPAN_MOV.textContent = PUZZLE.movimientos;
        SPAN_TIEMPO.textContent = formatearTiempo(PUZZLE.tiempo);
        MENSAJE.textContent = "🔄 Partida cargada.";
        clearInterval(PUZZLE.temporizador);
        PUZZLE.temporizador = setInterval(() => {
            PUZZLE.tiempo++;
            SPAN_TIEMPO.textContent = formatearTiempo(PUZZLE.tiempo);
        }, 1000);
        dibujarPuzzle();
    } else {
        MENSAJE.textContent = "⚠️ No hay partida guardada.";
    }
}


BOTON_INICIO.addEventListener("click", iniciarJuego);
BOTON_GUARDAR.addEventListener("click", guardarPartida);
BOTON_CARGAR.addEventListener("click", cargarPartida);

TABLA.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
        const idCelda = e.target.src.split("/").pop().split(".")[0];
        moverPieza(idCelda);
    }
});

// Mostrar mejor tiempo inicial
if (PUZZLE.mejorTiempo) {
    SPAN_MEJOR.textContent = formatearTiempo(PUZZLE.mejorTiempo);
}

// Mostrar puzzle inicial
PUZZLE.ordenActual = [...PUZZLE.ORDEN_INICIAL];
dibujarPuzzle();
