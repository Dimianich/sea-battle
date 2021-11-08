class Ship {
	size = null;
	direction = null;
	x = null;
	y = null;
	
	div = null;		

	constructor(x, y, size, direction) {

		Object.assign(this, { x, y, size, direction });
		
		const div = document.createElement("div");
		div.classList.add("ship");

		this.div = div;
		this.div.classList.add(`ship-${this.direction}-${this.size}`);		
	}

	
}
