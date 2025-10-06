class Plane {
  constructor(name, rows, cols, basePrice) {
    this.name = name;
    this.rows = rows;
    this.cols = cols;
    this.basePrice = basePrice;
    this.seats = Array.from({length: rows}, () => Array(cols).fill(false));
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

  // Método para liberar un asiento
  freeSeat(row, col) {
    if (this.seats[row][col]) {
      this.seats[row][col] = false;
      return true; // liberado
    }
    return false; // ya estaba libre
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

        if (this.seats[row][col]) {
          this.freeSeat(row, col); // liberar si estaba ocupado
        } else {
          this.reserveSeat(row, col); // reservar si estaba libre
        }

        // Volvemos a dibujar la tabla
        this.showSeatsTable();
      });
    });
  }
}

// Ejemplo de uso
const binterPlane = new Plane("Binter – Arrecife (ACE) → Madrid (MAD)", 20, 6, 100);
binterPlane.showSeatsTable();