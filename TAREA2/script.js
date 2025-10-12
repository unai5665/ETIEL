

// Función para añadir eventos a cada aerolínea
function setupAirlineEvents(elementId, destinationPage) {
  const el = document.getElementById(elementId);

 
  el.onmouseover = function() {
    console.log(`Pasando por ${elementId}`);
  };

  
  el.onmouseout = function() {
    console.log(`Saliendo de ${elementId}`);
  };

  
  el.onmousedown = function() {
    console.log(`Presionando clic en ${elementId}`);
  };


  el.onmouseup = function() {
    console.log(`Soltando clic en ${elementId}`);
    // Guardar la aerolínea seleccionada
    sessionStorage.setItem("selectedAirline", elementId);
    // Redirigir a la página correspondiente
    window.location.href = destinationPage;
  };
}

setupAirlineEvents("Binter", "binter.html");
setupAirlineEvents("CanaryFly", "canaryfly.html");
setupAirlineEvents("Iberia", "iberia.html");
