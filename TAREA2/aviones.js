// Clase para gestionar un avión

class Plane {
  constructor(name, rows, cols, basePrice) {
    this.name = name;
    this.rows = rows;
    this.cols = cols;
    this.basePrice = basePrice;
    // matriz de asientos: false = libre, true = ocupado
    this.seats = Array.from({length: rows}, () => Array(cols).fill(false));
  }

  // Reserva asientos, recibe lista como ['A1', 'B3']
  reserveSeats(seatList) {
    const already = [];
    seatList.forEach(seat => {
      const pos = this.decodeSeat(seat);
      if (!pos) return;
      const [r,c] = pos;
      if (this.seats[r][c]) already.push(seat);
      else this.seats[r][c] = true;
    });
    return already;
  }

  // Libera asientos
  freeSeats(seatList) {
    seatList.forEach(seat => {
      const pos = this.decodeSeat(seat);
      if (!pos) return;
      const [r,c] = pos;
      this.seats[r][c] = false;
    });
  }

  // Convierte código tipo "A1" a posición [fila, columna]
  decodeSeat(code) {
    const match = code.match(/^([A-Z])(\d+)$/i);
    if(!match) return null;
    const col = match[1].toUpperCase().charCodeAt(0) - 65;
    const row = parseInt(match[2],10) - 1;
    if(row < 0 || row >= this.rows || col < 0 || col >= this.cols) return null;
    return [row,col];
  }

  // Obtiene categoría según la fila
  getCategory(row) {
    if(row < 2) return 'business';
    if(row >= this.rows - 3) return 'lowcost';
    return 'economy';
  }

  // Precio del asiento según categoría
  seatPrice(row) {
    const category = this.getCategory(row);
    let multiplier = 1;
    if(category==='business') multiplier = 2.5;
    if(category==='economy') multiplier = 1.2;
    if(category==='lowcost') multiplier = 0.8;
    return +(this.basePrice * multiplier).toFixed(2);
  }

  // Mostrar tabla HTML
  showSeatsTable() {
    let html = `<h2>${this.name}</h2>`;
    html += `<table border="1" cellpadding="5" cellspacing="0"><tr><th>Fila</th>`;
    for(let c=0;c<this.cols;c++){
      html += `<th>${String.fromCharCode(65+c)}</th>`;
    }
    html += `</tr>`;
    for(let r=0;r<this.rows;r++){
      html += `<tr><td>${r+1} (${this.getCategory(r)})</td>`;
      for(let c=0;c<this.cols;c++){
        const free = !this.seats[r][c];
        const color = free ? 'green' : 'red';
        const price = this.seatPrice(r).toFixed(2)+'€';
        html += `<td style="background-color:${color}; text-align:center">
                    ${String.fromCharCode(65+c)}${r+1}<br>${price}
                 </td>`;
      }
      html += `</tr>`;
    }
    html += `</table>`;
    document.write(html);
  }

}


function startBooking() {
  let repeat = true;
  while(repeat){
    // Elegir compañía
    let msg = 'Elige aerolínea:\n';
    airlines.forEach((a,i)=> msg += `${i+1}. ${a.name}\n`);
    let choice = parseInt(prompt(msg)) -1;
    if(choice<0 || choice>=airlines.length) { alert('Opción inválida'); return; }
    const plane = airlines[choice];

    // Mostrar tabla de asientos
    plane.showSeatsTable();

    // Elegir asientos
    let seats = prompt("Introduce los asientos que quieres reservar, separados por coma (ej: A1,B3):");
    if(!seats) return;
    let seatList = seats.split(',').map(s=>s.trim());

    // Verificar disponibilidad
    const already = plane.reserveSeats(seatList);
    if(already.length>0){
      alert("Algunos asientos ya están ocupados: "+already.join(', '));
      continue;
    }

    // Calcular precio total
    let total = 0;
    seatList.forEach(seat=>{
      const pos = plane.decodeSeat(seat);
      total += plane.seatPrice(pos[0]);
    });

    // Preguntar si es residente
    const res = prompt("¿Eres residente? (s/n)").toLowerCase();
    if(res==='s') total = +(total*0.25).toFixed(2);

    alert(`Reserva confirmada. Precio total: ${total}€`);

    repeat = confirm("¿Deseas cambiar tu elección?");
    if(repeat) plane.freeSeats(seatList); // liberar si repite
  }
}

startBooking();

const airlines = [
  new Plane("VolcanAir", 10, 6, 100),
  new Plane("CanaryFly", 8, 4, 120),
  new Plane("Iberia", 12, 6, 150)
];
