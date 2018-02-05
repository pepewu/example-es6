interface CoordsConstructor {
	x: number;
	y: number;
	plus(other: Object): Object;
}

export class Coords implements CoordsConstructor {
	constructor(public x: number, public y: number) {}

	plus(other) {
		return new Coords(this.x + other.x, this.y + other.y);
	}
}