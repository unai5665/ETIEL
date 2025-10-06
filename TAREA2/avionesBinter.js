class Plane {
  constructor(name, rows, cols, basePrice) {
    this.name = name;
    this.rows = rows;
    this.cols = cols;
    this.basePrice = basePrice;
    this.seats = Array.from({length: rows}, () => Array(cols).fill(false));

  // Cargar asientos desde localStorage si existen
    const storedSeats = localStorage.getItem(this.name);
    if (storedSeats) {
      this.seats = JSON.parse(storedSeats);
    } else {
      // Generar asientos aleatorios: true = ocupado, false = libre
      this.seats = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Math.random() < 0.2) // 20% ocupados
      );
      localStorage.setItem(this.name, JSON.stringify(this.seats));
    }

   const storedSession = sessionStorage.getItem(this.name);
   this.selectedSeats = storedSession ? JSON.parse(storedSession) : [];

  }

  

  getCategory(row) {
    if (row < 2) return 'business';
    if (row >= this.rows - 3) return 'lowcost';
    return 'economy';
  }

  // función auxiliar para devolver color según categoría
getCategoryColor(category) {
  if (category === "business") return "orange";
  if (category === "economy") return "steelblue";
  if (category === "lowcost") return "gray";
  return "black";
}

// Método para reservar un asiento
  reserveSeat(row, col) {
    if (!this.seats[row][col]) {
      this.seats[row][col] = true;
      return true; // reservado
    }
    return false; // ya ocupado
  }

  // Obtener precio según categoría
  getSeatPrice(row) {
    const category = this.getCategory(row);
    if (category === "business") return this.basePrice * 3;      // ejemplo: 3x base
    if (category === "economy") return this.basePrice * 1.5;     // ejemplo: 1.5x base
    if (category === "lowcost") return this.basePrice;           // base
    return this.basePrice;
  }
  


    selectSeat(row, col) {
  const seatIndex = this.selectedSeats.findIndex(s => s.row === row && s.col === col);

  if (this.seats[row][col]) {
    // Asiento ocupado
    alert(`Asiento ${String.fromCharCode(65+col)}${row+1} ocupado ❌`);
    return;
  }

  if (seatIndex === -1) {
    // Asiento libre y no seleccionado → seleccionar
    const confirmSeat = confirm(`Has elegido el asiento ${String.fromCharCode(65+col)}${row+1}. ¿Aceptar?`);
    if (!confirmSeat) return;

    const isResident = confirm("¿Eres residente canario? Si aceptas, tendrás un descuento del 75%");
    let price = this.getSeatPrice(row);
    if (isResident) price *= 0.25; // aplicar 75% de descuento

    // Guardar selección en sessionStorage
    this.selectedSeats.push({ row, col, price, resident: isResident });
    sessionStorage.setItem(this.name, JSON.stringify(this.selectedSeats));

    alert(`Asiento ${String.fromCharCode(65+col)}${row+1} seleccionado. Precio final: €${price.toFixed(2)}`);

  } else {
    // Asiento ya seleccionado → preguntar si cancelar
    const cancelSeat = confirm(`¿Quieres cancelar la compra del asiento ${String.fromCharCode(65+col)}${row+1}?`);
    if (cancelSeat) {
      this.selectedSeats.splice(seatIndex, 1); // eliminar de la sesión
      sessionStorage.setItem(this.name, JSON.stringify(this.selectedSeats));
      alert(`Compra del asiento ${String.fromCharCode(65+col)}${row+1} cancelada ❌`);
    }
  }
  this.showSeatsTable();
}

  showSeatsTable() {
    let html = `<h2>${this.name}</h2>`;
    html += `<table>`;

    for (let r = 0; r < this.rows; r++) {
      const category = this.getCategory(r);
      html += `<tr><td class="row-number" style="color:${this.getCategoryColor(category)}">${r+1}</td>`;

      for (let c = 0; c < this.cols; c++) {
        if (c === 3) html += `<td class="aisle"></td>`; // pasillo

        // Asiento libre u ocupado según la matriz
        let seatClass = this.seats[r][c] ? "taken" : "available";

        // si está seleccionado en la sesión
        if (this.selectedSeats.some(s => s.row === r && s.col === c)) {
          seatClass = "selected";
        }


        html += `<td class="seat ${seatClass}" data-row="${r}" data-col="${c}">
                  ${String.fromCharCode(65+c)}${r+1}
                 </td>`;
      }

      html += `</tr>`;
    }

    html += `</table>`;
    const container = document.getElementById("seatsContainer");
    container.innerHTML = html;

    // Agregamos evento a cada asiento
    container.querySelectorAll(".seat").forEach(seat => {
        seat.addEventListener("click", (e) => {
          const row = parseInt(seat.dataset.row);
          const col = parseInt(seat.dataset.col);
          this.selectSeat(row, col);
      });
    });
  }
}

// Ejemplo de uso
const binterPlane = new Plane("Binter – Arrecife (ACE) → Madrid (MAD)", 20, 6, 44);
binterPlane.showSeatsTable();

document.getElementById("selectedSeatsIcon").addEventListener("click", () => {
    if (binterPlane.selectedSeats.length === 0) {
        alert("No has seleccionado ningún asiento.");
        return;
    }

    const seatsList = binterPlane.selectedSeats
        .map(s => `${String.fromCharCode(65+s.col)}${s.row+1} - €${s.price.toFixed(2)}`)
        .join("\n");

    alert(`Asientos seleccionados:\n${seatsList}`);
});
