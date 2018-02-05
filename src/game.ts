import { UI, ctx, config } from './config';
import { Grid } from './Grid';
import { Board } from './Board';
import { Tetramino, TetraminosFactory } from './Tetramino';
import { Stats } from './Stats';

/**
 * Main game object
 */
export let game = {
	init: function () {
		this.tetrafactory = new TetraminosFactory();
		this.grid = new Grid();
		this.board = new Board(this.grid);
		this.stats = new Stats(UI.score, UI.level);

		this.movesQueue = [];

		this.events();
		this.newGame();
	},

	gameState: {
		state: '',
		needsRedraw: true,
		dropInterval: config.initialDropInterval,
		lastDropTime: new Date().getTime(),
		timeSinceLastDrop: null,
	},

	events: function () {
		document.addEventListener('keydown', (e) => {
			switch (e.keyCode) {
				case 39:
					this.movesQueue.push('right');
					break;
				case 37:
					this.movesQueue.push('left');
					break;
				case 38:
					this.movesQueue.push('rotate');
					break;
				case 40:
					this.movesQueue.push('down');
					break;
				case 32:
					this.movesQueue.push('drop');
					break;
			}
		});

		UI.newGameButton.addEventListener('click', (e) => {
			e.preventDefault();
			UI.newGameButton.blur();
			this.newGame();
		});

		UI.pauseButton.addEventListener('click', (e) => {
			e.preventDefault();
			if (this.gameState.state == 'paused') {
				this.resumeGame();
				UI.pauseButton.classList.remove('active');
			}
			if (this.gameState.state == 'playing') {
				this.pauseGame();
				UI.pauseButton.classList.add('active');
			}
			UI.pauseButton.blur();
		});

		window.addEventListener('focus', () => {
			if (this.gameState.state == 'paused' && ! UI.pauseButton.classList.contains('active')) {
				this.resumeGame();
			}
		});
		window.addEventListener('blur', () => {
			this.pauseGame();
		});
	},

	newGame: function () {
		this.stats.reset();
		this.gameState.state = 'playing';
		this.grid.reset();
		this.movesQueue = [];
		this.initTetramino();
		this.gameState.dropInterval = config.initialDropInterval;
		this.lastDropTime = new Date().getTime();
		this.gameState.needsRedraw = true;

		this.tick();
	},

	pauseGame: function () {
		if (this.gameState.state == 'playing') {
			this.gameState.state = 'paused';
			this.board.drawPause();
		}
	},

	resumeGame: function () {
		this.gameState.state = 'playing';
		this.gameState.needsRedraw = true;
		this.gameState.lastDropTime = new Date().getTime();
		this.tick();
	},

	endGame: function () {
		this.movesQueue = [];
		this.gameState.state = 'ended';
		this.gameState.needsRedraw = false;
		this.board.drawGameOver();
	},

	initTetramino: function () {
		let dx, dy, dr;
		this.currentTetramino = this.tetrafactory.createRandom();

		this.movesQueue = [];
		this.gameState.lastDropTime = new Date().getTime() - 500;
		this.executeMovesQueue();

		dx = 0;
		dy = 1;
		dr = this.currentTetramino.currentRotation;

		if (!this.grid.canFit(this.currentTetramino, dx, dy, dr)) {
			this.endGame();
		}

		this.initGhostTetramino();
		this.hintNext();
	},

	initGhostTetramino: function () {
		this.ghostTetramino = Object.create(this.currentTetramino);
		this.ghostTetramino.color = '#222';
		this.ghostTetramino.type = 'ghost';

		this.positionGhost();
	},

	hintNext: function () {
		this.board.drawNext(this.tetrafactory.getNextType());
	},

	checkMove: function (moveType) {
		let dx = 0,
			dy = 0,
			dr = this.currentTetramino.currentRotation,
			canMove = false,
			dropmove = true;

		switch (moveType) {
			case 'down':
				dy++;
				break;
			case 'tickDown':
				dy++;
				break;
			case 'right':
				dx++;
				break;
			case 'left':
				dx--;
				break;
			case 'rotate':
				dr++;
				if (dr == 4) {
					dr = 0;
				}
				break;
			case 'drop':
				while (dropmove) {
					if (this.grid.canFit(this.currentTetramino, 0, 1, dr)) {
						this.currentTetramino.y += 1;
						this.stats.count('down');
					} else {
						dropmove = false;
					}
				}
				return false;
		}
		canMove = this.grid.canFit(this.currentTetramino, dx, dy, dr);

		if (canMove) {
			this.currentTetramino.x += dx;
			this.currentTetramino.y += dy;
			this.currentTetramino.currentRotation = dr;

			this.ghostTetramino.x = this.currentTetramino.x;
			this.ghostTetramino.currentRotation = this.currentTetramino.currentRotation;
			this.positionGhost();
		}

		return canMove;
	},

	positionGhost: function () {
		let dropmove = true,
			dr = this.currentTetramino.currentRotation;

		this.ghostTetramino.y = 0;
		while (dropmove) {
			if (this.grid.canFit(this.ghostTetramino, 0, 1, dr)) {
				this.ghostTetramino.y += 1;
			} else {
				dropmove = false;
			}
		}
	},

	executeMovesQueue: function () {
		this.movesQueue.every(moveType => {
			this.movesQueue.shift();
			let canMove = this.checkMove(moveType);

			if (canMove) {
				// redraw board;
				this.gameState.needsRedraw = true;

				if (moveType == 'down') {
					this.stats.count('down');
				}
				if (moveType == 'tickDown') {
					this.gameState.lastDropTime = new Date().getTime();
				}
			} else {
				if (moveType == 'down' || moveType == 'drop' || moveType == 'tickDown') {
					// save tetramino to grid
					this.movesQueue = [];
					this.grid.saveTetramino(this.currentTetramino);

					// check full lines
					let cleared = this.grid.clearRows();
					this.stats.countLines(cleared);
					if (this.stats.checkLevelUp()) {
						this.gameState.dropInterval = (this.gameState.dropInterval > 250) ? (this.gameState.dropInterval - this.stats.level * 15) : 250;
					}

					this.gameState.needsRedraw = true;

					// set new tetramino
					this.initTetramino();

					return false;
				}
			}
		});
	},

	tick: function () {
		let self = this,
			timestamp = new Date().getTime();

		// check time and set Tetramino to move down if needed
		let deltaTime = timestamp - this.gameState.lastDropTime;
		if (deltaTime >= this.gameState.dropInterval) {
			this.movesQueue.push('tickDown');
		}

		// check moves queue, apply them
		this.executeMovesQueue();

		// redraw board if needed
		if (this.gameState.needsRedraw) {
			this.board.draw();
			this.board.drawTetramino(self.ghostTetramino);
			this.board.drawTetramino(self.currentTetramino);
			this.gameState.needsRedraw = false;
		}

		// tick again
		if (this.gameState.state == 'playing') {
			requestAnimationFrame(game.tick.bind(self));
		}
	},
}