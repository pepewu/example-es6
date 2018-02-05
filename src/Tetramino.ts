let shapes = {
	I: {
		shapeMap: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		color: '#59d9ff'
	},
	J: {
		shapeMap: [1, 0, 0, 1, 1, 1, 0, 0, 0],
		color: '#471df9'
	},
	L: {
		shapeMap: [0, 0, 1, 1, 1, 1, 0, 0, 0],
		color: '#f28f0e'
	},
	O: {
		shapeMap: [1, 1, 1, 1],
		color: '#f4c338'
	},
	S: {
		shapeMap: [0, 1, 1, 1, 1, 0, 0, 0, 0],
		color: '#73e120'
	},
	Z: {
		shapeMap: [1, 1, 0, 0, 1, 1, 0, 0, 0],
		color: '#cc2e13'
	},
	T: {
		shapeMap: [0, 1, 0, 1, 1, 1, 0, 0, 0],
		color: '#9a17ef'
	}
}

interface TetraminoInterface {
	x: number,
	y: number,
	color: string,
	rotations: number[][],
	currentRotation: number,
	size: number,
	type: string,
	shape: string
}

/**
 * Tetramino constructor
 */
export class Tetramino implements TetraminoInterface {
	x: number;
	y: number;
	color: string;
	rotations: number[][];
	currentRotation: number;
	size: number;
	type: string;
	shape: string;

	/**
	 * Creates an instance of Tetramino.
	 */
	constructor(config) {
		this.x = config.x || 0;
		this.y = config.y || 0;
		this.color = config.color;
		this.rotations = config.rotations;
		this.currentRotation = 0;
		this.size = config.size;
		this.type = config.type || 'normal';
		this.shape = config.shape;
	}

	get(x: number, y: number) {
		return this.rotations[this.currentRotation][x + (y * this.size)];
	}
}


/**
 * Factory class for creating Tetramino instances of given shape
 */
export class TetraminosFactory {
	bag: string[];

	constructor() {
		this.bag = this.fillBag();
	}

	/**
	 * Returns the Tetramino instance for given shape id
	 */
	public create(type: string): Tetramino {
		return new Tetramino({
			shape: type.toUpperCase(),
			type: 'normal',
			color: shapes[type.toUpperCase()].color,
			size: Math.sqrt(shapes[type.toUpperCase()].shapeMap.length),
			rotations: this._generateRotations(type),
			x: 3,
			y: -1
		});
	}

	public createRandom(): Tetramino {
		if (this.bag.length == 0) {
			this.bag = this.fillBag();
		}
		return this.create(this.bag.shift());
	}

	public getNextType(): Tetramino {
		if (this.bag.length == 0) {
			this.bag = this.fillBag();
		}
		return this.create(this.bag[0]);
	}

	private fillBag(): string[] {
		let shapes = ['I', 'J', 'L', 'O', 'S', 'Z', 'T'];
		shapes.sort(function (a, b) {
			return 0.5 - Math.random();
		});
		return shapes;
	}

	/**
	 * Returns right side rotation of given array
	 */
	private _rotateShape(shape: number[]) {
		let len = Math.sqrt(shape.length);
		let rotation = [];
		for (let i = 0; i < len; i++) {
			for (let j = 0; j < len; j++) {
				rotation[len - i - 1 + (j * len)] = shape[j + (i * len)];
			}
		}
		return rotation;
	}


	/**
	 * Generates all 4 rotations for given shape type
	 */
	private _generateRotations(type) {
		let rotations = [];
		rotations.push(shapes[type.toUpperCase()].shapeMap);

		for (let i = 0; i < 3; i++) {
			let rotation = this._rotateShape(rotations[i]);
			rotations.push(rotation);
		}

		return rotations;
	}
}