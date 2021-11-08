class Battlefield {
	root = null;
	table = null;
	polygon = null;
	sea = null;

	ships = [];
	shots = [];
	cells = [];

	constructor() {		

		const root = document.createElement("div");
		root.classList.add("battlefield");

		const table = document.createElement("table");
		table.classList.add("battlefield-table");

		const sea = document.createElement("div");
		sea.classList.add("battlefield-sea");

		const polygon = document.createElement("div");
		polygon.classList.add("battlefield-polygon");

		root.append(table, sea, polygon);

		Object.assign(this, { root, table, sea, polygon });

		for (let y = 0; y < 10; y++) {
			const row = [];
			const tr = document.createElement("tr");
			tr.classList.add("battlefield-row");
			tr.dataset.y = y;

			for (let x = 0; x < 10; x++) {
				const td = document.createElement("td");
				td.classList.add("battlefield-item");
				Object.assign(td.dataset, { x, y });

				tr.append(td);
				row.push(td);
			}

			table.append(tr);
			this.cells.push(row);
		}

		for (let x = 0; x < 10; x++) {
			const cell = this.cells[0][x];
			const marker = document.createElement("div");

			marker.classList.add("marker", "marker-column");
			marker.textContent = x + 1;

			cell.append(marker);
		}

		for (let y = 0; y < 10; y++) {
			const cell = this.cells[y][0];
			const marker = document.createElement("div");

			marker.classList.add("marker", "marker-row");
			marker.textContent = "abcdefghig"[y];

			cell.append(marker);
		}
	}

	addShip(x, y, size, direction) {

		let ship = new Ship(x, y, size, direction);		

		this.ships.push(ship);

		this.sea.append(ship.div);

		const cellRect = this.cells[ship.y][ship.x].getBoundingClientRect();
		const rootRect = this.root.getBoundingClientRect();

		ship.div.style.left = `${cellRect.left - rootRect.left}px`;
		ship.div.style.top = `${cellRect.top - rootRect.top}px`;
		return true;
	}

	removeShips() {
		for (const ship of this.ships) {
			if (Array.prototype.includes.call(this.sea.children, ship.div)) {
				ship.div.remove();
			}
		}

		this.ships = [];
	}

	addShot(x, y, variant) {
		let shot = new Shot(x, y, variant);		

		this.shots.push(shot);

		this.polygon.append(shot.div);

		const cellRect = this.cells[shot.y][shot.x].getBoundingClientRect();
		const rootRect = this.root.getBoundingClientRect();

		shot.div.style.left = `${cellRect.left - rootRect.left}px`;
		shot.div.style.top = `${cellRect.top - rootRect.top}px`;
		return true;
	}

	removeShots() {
		for (const shot of this.shots) {
			if (Array.prototype.includes.call(this.polygon.children, shot.div)) {
				shot.div.remove();
			}
		}
		this.shots = [];
	}

	setShips(ships) {
		this.removeShips();		
		for (let ship of ships) {
			this.addShip(ship.x, ship.y, ship.size, ship.direction);
		}
	}

	clear() {
		this.removeShots();
		this.removeShips();
	}
}
