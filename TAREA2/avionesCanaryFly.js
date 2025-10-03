class Plane {
    constructor(name, rows, cols, basePrice) {
        this.name = name;
        this.rows = rows;
        this.cols = cols;
        this.basePrice = basePrice;
        this.seats = Array.from({length: rows}, () => Array(cols).fill(false));
    }

    getCategory(row) {
        if(row < 2) return 'business';
        if(row >= this.rows - 3) return 'lowcost';
        return 'economy';
    }

    seatPrice(row) {
        const category = this.getCategory(row);
        let multiplier = 1;
        if(category==='business') multiplier = 2.5;
        if(category==='economy') multiplier = 1.2;
        if(category==='lowcost') multiplier = 0.8;
        return +(this.basePrice * multiplier).toFixed(2);
    }

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
        document.getElementById('seatsContainer').innerHTML = html;
    }
}

// Crear el avión de esta aerolínea
const binterPlane = new Plane("CanaryFly – Arrecife (ACE) → Madrid (MAD)", 10, 6, 100);

binterPlane.showSeatsTable();
