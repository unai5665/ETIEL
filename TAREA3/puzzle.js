
const PUZZLE = {
    ORDEN_INICIAL: ["1","2","3","4","5","6","7","8","empty"],
    ordenActual: [],
    movimientos: 0,
    tiempo: 0,
    temporizador: null,
    mejorTiempo: localStorage.getItem("mejorTiempo") || null,
};


const BOTON_INICIO = document.getElementById("btn-inicio");
const BOTON_GUARDAR = document.getElementById("btn-guardar");
const BOTON_CARGAR = document.getElementById("btn-cargar");
const TABLA = document.getElementById("puzzle");
const SPAN_MOV = document.getElementById("movimientos");
const SPAN_TIEMPO = document.getElementById("tiempo");
const SPAN_MEJOR = document.getElementById("mejor-tiempo");
const MENSAJE = document.getElementById("mensaje");



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
        MENSAJE.textContent = `¡Completado en ${PUZZLE.movimientos} movimientos y ${formatearTiempo(PUZZLE.tiempo)}!`;

        // Guardar mejor tiempo
        if (!PUZZLE.mejorTiempo || PUZZLE.tiempo < PUZZLE.mejorTiempo) {
            localStorage.setItem("mejorTiempo", PUZZLE.tiempo);
            PUZZLE.mejorTiempo = PUZZLE.tiempo;
            SPAN_MEJOR.textContent = formatearTiempo(PUZZLE.tiempo);
        }
    }
}


function formatearTiempo(segundos) {
    const min = String(Math.floor(segundos / 60)).padStart(2, "0");
    const sec = String(segundos % 60).padStart(2, "0");
    return `${min}:${sec}`;
}



function obtenerVecinos(posVacio) {
    const vecinos = [];
    const filas = 3;
    const col = posVacio % filas;
    const fila = Math.floor(posVacio / filas);

    if (fila > 0) vecinos.push(posVacio - filas);      // arriba
    if (fila < filas - 1) vecinos.push(posVacio + filas); // abajo
    if (col > 0) vecinos.push(posVacio - 1);           // izquierda
    if (col < filas - 1) vecinos.push(posVacio + 1);   // derecha

    return vecinos;
}

// Mezclar el puzzle realizando movimientos válidos aleatorios
function mezclarPuzzle(pasos = 100) {
    let orden = [...PUZZLE.ORDEN_INICIAL];
    let posVacio = orden.indexOf("empty");

    // Mezclar con movimientos válidos aleatorios
    for (let i = 0; i < pasos; i++) {
        const vecinos = obtenerVecinos(posVacio);
        const aleatorio = vecinos[Math.floor(Math.random() * vecinos.length)];

        [orden[posVacio], orden[aleatorio]] = [orden[aleatorio], orden[posVacio]];
        posVacio = aleatorio;
    }

    // Asegurar que el espacio vacío termine en la esquina inferior derecha
    const posicionObjetivo = 8; // esquina inferior derecha
    while (posVacio !== posicionObjetivo) {
        const vecinos = obtenerVecinos(posVacio);
        // Elige un vecino que acerque al vacío hacia la esquina inferior derecha
        let mejorMovimiento = vecinos[Math.floor(Math.random() * vecinos.length)];

        // Opcional: intenta mover hacia abajo o derecha si es posible
        if (posVacio < posicionObjetivo) {
            const preferido = vecinos.find(v => v > posVacio);
            if (preferido !== undefined) mejorMovimiento = preferido;
        }

        [orden[posVacio], orden[mejorMovimiento]] = [orden[mejorMovimiento], orden[posVacio]];
        posVacio = mejorMovimiento;
    }

    return orden;
}


// Iniciar juego (usando mezcla realista)
function iniciarJuego() {
    PUZZLE.ordenActual = mezclarPuzzle(100); // mezclar con 100 movimientos válidos
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
    MENSAJE.textContent = "Partida guardada correctamente.";
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
        MENSAJE.textContent = "Partida cargada.";
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

// Mostrar mejor tiempo si existe
if (PUZZLE.mejorTiempo) {
    SPAN_MEJOR.textContent = formatearTiempo(PUZZLE.mejorTiempo);
}

// Mostrar puzzle inicial
PUZZLE.ordenActual = [...PUZZLE.ORDEN_INICIAL];
dibujarPuzzle();
