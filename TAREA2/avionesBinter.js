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

  showSeatsTable() {
  let html = `<h2>${this.name}</h2>`;
  html += `<table>`;

  for (let r = 0; r < this.rows; r++) {
    const category = this.getCategory(r); // business, economy, lowcost

    // primera celda: número de la fila coloreado
    html += `<tr><td class="row-number" style="color:${this.getCategoryColor(category)}">${r+1}</td>`;

    for (let c = 0; c < this.cols; c++) {
      if (c === 3) { 
        html += `<td class="aisle"></td>`; // pasillo
      }

      // asientos verdes por defecto
      html += `<td class="seat available">
                 ${String.fromCharCode(65+c)}${r+1}
               </td>`;
    }
    html += `</tr>`;
  }

  html += `</table>`;
  document.getElementById("seatsContainer").innerHTML = html;
}

// función auxiliar para devolver color según categoría
getCategoryColor(category) {
  if (category === "business") return "orange";
  if (category === "economy") return "steelblue";
  if (category === "lowcost") return "gray";
  return "black";
}
}

// Ejemplo con avión 20 filas y 6 asientos por fila (3+3)
const binterPlane = new Plane("Binter – Arrecife (ACE) → Madrid (MAD)", 20, 6, 100);
binterPlane.showSeatsTable();