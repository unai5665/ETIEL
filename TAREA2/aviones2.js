class Plane {
  constructor(name, rows, cols, basePrice, varName) {
    this.name = name;
    this.rows = rows;
    this.cols = cols;
    this.basePrice = basePrice;
    this.varName = varName; // 👈 nombre de variable única

    // Cargar asientos desde localStorage si existen
    const storedSeats = localStorage.getItem(this.name);
    if (storedSeats) {
      this.seats = JSON.parse(storedSeats);
    } else {
      // Generar asientos aleatorios
      this.seats = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Math.random() < 0.2)
      );
      localStorage.setItem(this.name, JSON.stringify(this.seats));
    }

    // Cargar seleccionados de la sesión
    const storedSession = sessionStorage.getItem(this.name);
    this.selectedSeats = storedSession ? JSON.parse(storedSession) : [];
  }

  getCategory(row) {
    if (row < 2) return "business";
    if (row >= this.rows - 3) return "lowcost";
    return "economy";
  }

  getCategoryColor(category) {
    if (category === "business") return "orange";
    if (category === "economy") return "steelblue";
    if (category === "lowcost") return "gray";
    return "black";
  }

  getSeatPrice(row) {
    const category = this.getCategory(row);
    if (category === "business") return this.basePrice * 3;
    if (category === "economy") return this.basePrice * 1.5;
    return this.basePrice;
  }

  selectSeat(row, col) {
    const seatIndex = this.selectedSeats.findIndex((s) => s.row === row && s.col === col);

    if (this.seats[row][col]) {
      alert(`Asiento ${String.fromCharCode(65 + col)}${row + 1} ocupado `);
      return;
    }

    if (seatIndex === -1) {
      const confirmSeat = confirm(
        `Has elegido el asiento ${String.fromCharCode(65 + col)}${row + 1}. ¿Aceptar?`
      );
      if (!confirmSeat) return;

      const isResident = confirm("¿Eres residente canario?");
      let price = this.getSeatPrice(row);
      if (isResident) price *= 0.25;

      this.selectedSeats.push({ row, col, price, resident: isResident });
      sessionStorage.setItem(this.name, JSON.stringify(this.selectedSeats));

      alert(
        `Asiento ${String.fromCharCode(65 + col)}${row + 1} seleccionado. Precio final: ${price.toFixed(2)}€`
      );
    } else {
      const cancelSeat = confirm(
        `¿Quieres cancelar la compra del asiento ${String.fromCharCode(65 + col)}${row + 1}?`
      );
      if (cancelSeat) {
        this.selectedSeats.splice(seatIndex, 1);
        sessionStorage.setItem(this.name, JSON.stringify(this.selectedSeats));
        alert(`Compra del asiento ${String.fromCharCode(65 + col)}${row + 1} cancelada `);
      }
    }

    this.showSeatsTable();
  }

  showSeatsTable() {
    let html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="aviones.css">
        <title>${this.name}</title>
      </head>
      <body>
        <a href="index.html" id="logo">
          <img src="aerolinia.png" alt="Logo aerolíneas">
        </a>

        <img id="selectedSeatsIcon"
             src="carrito.png"
             alt="Asientos seleccionados"
             style="position:fixed; top:15px; right:15px; width:50px; cursor:pointer;">

        <h2>${this.name}</h2>
        <table border="1" cellspacing="0" cellpadding="5">
    `;

    for (let r = 0; r < this.rows; r++) {
      const category = this.getCategory(r);
      html += `<tr><td style="color:${this.getCategoryColor(category)}; font-weight:bold">${r + 1}</td>`;

      for (let c = 0; c < this.cols; c++) {
        if (c === Math.floor(this.cols / 2)) html += `<td style="background:#333; width:20px"></td>`; // pasillo

        let seatClass = this.seats[r][c] ? "red" : "lightgreen";
        if (this.selectedSeats.some((s) => s.row === r && s.col === c)) {
          seatClass = "green"; // seleccionado
        }

        html += `<td style="background:${seatClass}; cursor:pointer;" onclick="${this.varName}.selectSeat(${r},${c})">
                   ${String.fromCharCode(65 + c)}${r + 1}
                 </td>`;
      }
      html += `</tr>`;
    }

    html += `
        </table>

        <div id="legend">
          <div class="legend-item"><span class="color business"></span> Business: ${this.basePrice * 3}€ </div>
          <div class="legend-item"><span class="color economy"></span> Economy: ${this.basePrice * 1.5}€ </div>
          <div class="legend-item"><span class="color lowcost"></span> Low-cost: ${this.basePrice}€ </div>
          <div class="legend-item"><span class="color taken"></span> Ocupado</div>
          <div class="legend-item"><span class="color available"></span> Libre</div>
        </div>

        <script>
          document.getElementById("selectedSeatsIcon").addEventListener("click", () => {
            if (${this.varName}.selectedSeats.length === 0) {
              alert("No has seleccionado ningún asiento.");
              return;
            }

            const seatsList = ${this.varName}.selectedSeats
              .map(s => \`\${String.fromCharCode(65+s.col)}\${s.row+1} - €\${s.price.toFixed(2)}\`)
              .join("\\n");

            alert("Asientos seleccionados:\\n" + seatsList);
          });
        </script>
      </body>
    </html>
    `;

    document.open();
    document.write(html);
    document.close();
  }
}

//Crear el avión de CanaryFly
const canaryFlyPlane = new Plane(
  "CanaryFly – Arrecife (ACE) → Madrid (MAD)",
  10, // filas
  8,  // columnas
  5,  // precio base
  "canaryFlyPlane" 
);

canaryFlyPlane.showSeatsTable();
