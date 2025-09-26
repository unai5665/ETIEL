  
  console.log("Por favor introduce tus respuestas");

  alert("Vamos a elegir las el número de tiendas debes elegir de 0 a 5.") 
  // Formulario

  let numTiendas;

  while (true) {
    let tiendas = prompt("¿Cuántas tiendas hay en la calle?");
    numTiendas = parseInt(tiendas, 10); // convertimos a entero en base 10

    if (!isNaN(numTiendas) && numTiendas >= 0 && numTiendas <= 5) {
      break; //número válido, salimos del bucle
    } else {
      alert("Debes escribir un número entre 0 y 5.");
    }
  }

  console.log("Has dicho que hay " + numTiendas + " tiendas.");


  let numPrimeraPuerta;

  while (true) {
    let  numero = prompt("¿Que número tiene la primera puerta?");
    numPrimeraPuerta = parseInt(numero, 10); 

    if (!isNaN(numPrimeraPuerta) && numPrimeraPuerta >= 0) break;

      alert("Debes escribir un número válido.");
    }
  

  console.log("Has dicho que el número de la primera puerta es " + numPrimeraPuerta + " .");

let horaActual;
while (true) { 
  let hora = prompt("¿Qué hora es? (1-12)");
  horaActual = parseInt(hora, 10);
  if(!Number.isNaN(horaActual) && horaActual >= 1 && horaActual <= 12) break;
  alert("Debes escribir una hora válida.")
}

let colorSemaforo;
while (true) {
  let semaforo = prompt("¿En qué color está el semáforo? (rojo, ambar, verde)").trim().toLowerCase();
  if (["rojo","ambar","verde"].includes(semaforo)) { 
  colorSemaforo = semaforo; 
  break;  }
  alert("Escribe 'rojo', 'ambar' o 'verde'.");
}


let numCoches;
while (true) {
  let coches = prompt("¿Cuántos coches hay? (0-5)");
  numCoches = parseInt(coches, 10);
  if (!Number.isNaN(numCoches) && numCoches >= 0 && numCoches <= 5) break;
  alert("Introduce un número entre 0 y 5.");
}

let numerosPuertas = [];
for (let i = 0; i < numTiendas; i++) {
  numerosPuertas.push(numPrimeraPuerta + i * 2);
}


//CONSTANTES PARA LAS IMAGENES


const IMG_CARTELES = [
  "cartel1.png",
  "cartel2.png",
  "cartel3.png",
  "cartel4.png",
  "cartel5.png"
];

const IMG_PUERTAS = Array(5).fill(
  "puerta1.png"
);

const IMG_OFERTAS = [
  "oferta1.png",
  "oferta2.png",
  "oferta3.png",
  "oferta4.png",
  "oferta5.png"
];

const IMG_NUMEROS = [
  "num20.png",
  "num22.png",
  "num24.png",
  "num26.png",
  "num28.png"
];

const IMG_HORAS = [
  "una.png","una.png", "dos.png", "tres.png", "cuatro.png", "cinco.png", "seis.png", "siete.png", "ocho.png", "nueve.png", "diez.png", "once.png", "doce.png"
];


const IMG_SEMAFORO = {
  rojo: "rojo.png",
  ambar: "ambar.png",
  verde: "verde.png"
};


const IMG_COCHE = "coche.png"; 



  // --- Construcción de la escena ---
  let html = "";

  // Fila 1: carteles
  html += '<div class="row first">';
  for (let i = 0; i < numTiendas; i++) {
    html += `<img src="${IMG_CARTELES[i]}" alt="cartel">`;
  }
  html += '</div>';

  // Fila 2: puertas
  html += '<div class="row second">';
  for (let i = 0; i < numTiendas; i++) {
    html += `<div class="shop"><img src="${IMG_PUERTAS[i]}" alt="puerta"><img src="${IMG_NUMEROS[i]}" alt="número"></div>`;
  }
  html += '</div>';

  // Fila 3: escaparates y ofertas
  html += '<div class="row third">';
  for (let i = 0; i < numTiendas; i++) {
    html += `<div class="shop"><img src="${IMG_OFERTAS[i]}" alt="oferta"></div>`;
  }
  html += '</div>';

  // Fila 4: reloj y semáforo
  html += '<div class="row fourth">';
  html += `<div class="clock"><img src="${IMG_HORAS[horaActual]}" alt="hora ${horaActual}"></div>`;
  html += `<div class="traffic"><img src="${IMG_SEMAFORO[colorSemaforo]}" alt="semaforo ${colorSemaforo}"></div>`;
  html += '</div>';

  // Fila 5: coches
  html += '<div class="row fifth">';
  for (let i = 0; i < numCoches; i++) {
    html += `<img class="car" src="${IMG_COCHE}" alt="coche ${i+1}">`;
  }
  html += '</div>';

  // Mostrar en el documento
  document.write(html);