class Shot {
	x = null;
	y = null;
	variant = null;
	div = null;

	constructor(x, y, variant) {

		Object.assign(this, { x, y, variant });

		const div = document.createElement("div");
		div.classList.add("shot");

		this.div = div;
		this.setVariant(this.variant);		
	}

	setVariant(variant) {
		this.variant = variant;
		this.div.classList.remove("shot-missed", "shot-wounded", "shot-killed");
		this.div.textContent = "";
	
		if (this.variant === "missed") {
			this.div.classList.add("shot-missed");
			this.div.textContent = "•";
		} else if (this.variant === "wounded") {
			this.div.classList.add("shot-wounded");
		} else if (this.variant === "killed") {
			this.div.classList.add("shot-wounded", "shot-killed");
		}
	}
}
