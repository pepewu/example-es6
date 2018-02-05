import { UI, config, ctx, ctxNext } from './config';
import { Coords } from './Coords';
import { Grid } from './Grid';
import { Tetramino } from './Tetramino';


/**
 * Lighten / Darken Color
 * @url: https://css-tricks.com/snippets/javascript/lighten-darken-color/
 */
function lightenDarkenColor(r,n){r=r.slice(1);var t=parseInt(r,16),a=(t>>16)+n;a>255?a=255:a<0&&(a=0);var e=(t>>8&255)+n;e>255?e=255:e<0&&(e=0);var i=(255&t)+n;return i>255?i=255:i<0&&(i=0),"#"+(i|e<<8|a<<16).toString(16)}


export class Board {
	ratio: number;
	canvasUnit: number;
	nextUnit: number;
	tetramino: Tetramino;
	nextTetramino: Tetramino;

	constructor(public grid: Grid) {
		this.redrawAll();
		this.events();
	}

	public events() {
		let resizeTimer;

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.redrawAll();
            }, 250);
        });
    }
    
    private redrawAll() {
        UI.canvas.width = UI.canvas.height = 0;
        UI.next.width = UI.next.height = 0;
        this.setCanvas();
        this.draw();

        if (! this.tetramino) return;
        
        this.drawTetramino(this.tetramino);
        this.drawNext(this.nextTetramino);
    }

	private _getRatio() {
		let h = UI.canvasContainer.clientHeight;
		return h / config.canvasHeigth;
	}

	public setCanvas() {
		let sw = window.innerWidth - 30,
			sh = window.innerHeight - 40,
			sRatio = sw / sh;

		let gameBoardRatio = 0.7;

		if (sRatio > gameBoardRatio) {
			UI.ratioContainer.style.height = sh + 'px';
			UI.ratioContainer.style.width = (sh * gameBoardRatio) + 'px';
		} else {
			UI.ratioContainer.style.width = sw + 'px';
			UI.ratioContainer.style.height = (sw / gameBoardRatio) + 'px';
		}

		this.ratio = this._getRatio();
		this.canvasUnit = Math.round(config.canvasCellSize * this.ratio);

		UI.canvas.width = this.canvasUnit * config.cellsHoriz;
		UI.canvas.height = this.canvasUnit * config.cellsVert;

		// next tetramino canvas
		this.nextUnit = Math.round(UI.nextContainer.clientWidth / 4);
		UI.next.width = this.nextUnit * 4;
		UI.next.height = this.nextUnit * 2;
	}

	public drawGrid() {
		ctx.clearRect(0, 0, UI.canvas.width, UI.canvas.height);
		ctx.save();
		ctx.translate(0.5, 0.5);
		ctx.beginPath();
		ctx.lineWidth = 1;
		for (let i = 1; i <= this.grid.height; i++) {
			ctx.moveTo(0, i * this.canvasUnit);
			ctx.lineTo(UI.canvas.width, i * this.canvasUnit);
		}
		for (let i = 1; i <= this.grid.width; i++) {
			ctx.moveTo(i * this.canvasUnit, 0);
			ctx.lineTo(i * this.canvasUnit, UI.canvas.height);
		}
		ctx.strokeStyle = '#444';
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}

	private renderShape(ctx, unit, x, y, color) {
		let lighterColor = lightenDarkenColor(color, 30),
			darkerColor = lightenDarkenColor(color, -40);

        ctx.fillStyle = color;
        ctx.fillRect(x, y, unit, unit);

		ctx.beginPath();
		ctx.fillStyle = lighterColor;
		ctx.lineTo(x + unit, y);
		ctx.lineTo(x + unit * 0.85, y + unit * 0.15);
		ctx.lineTo(x + unit * 0.15, y + unit * 0.15);
		ctx.lineTo(x + unit * 0.15, y + unit * 0.85);
		ctx.lineTo(x, y + unit);
		ctx.lineTo(x, y);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.fillStyle = darkerColor;
		ctx.lineTo(x, y + unit);
		ctx.lineTo(x + unit, y + unit);
		ctx.lineTo(x + unit, y);
		ctx.lineTo(x + unit * 0.85, y + unit * 0.15);
		ctx.lineTo(x + unit * 0.85, y + unit * 0.85);
		ctx.lineTo(x + unit * 0.15, y + unit * 0.85);
		ctx.closePath();
		ctx.fill();
	}

    public drawCells() {
        this.grid.space.forEach((cell, index) => {
            let x = (index % this.grid.width) * this.canvasUnit;
            let y = Math.floor(index / this.grid.width) * this.canvasUnit;

            if (cell.type == 'empty') return;

            this.renderShape(ctx, this.canvasUnit, x, y, cell.color);
        });
    }

    public drawTetramino(ttm: Tetramino) {
        // save local reference to current tetramino instance
        this.tetramino = ttm;

        ttm.rotations[ttm.currentRotation].forEach((cell, index) => {
            if (! cell) return;
            this.drawTetraminoCell(cell, index, ttm);
        });
    }

    private drawTetraminoCell(cell, index, ttm) {
        let cellX = index % ttm.size,
            cellY = Math.floor(index / ttm.size),
            boardX = (ttm.x + cellX) * this.canvasUnit,
            boardY = (ttm.y + cellY) * this.canvasUnit;

        ctx.fillStyle = ttm.color;
        ctx.fillRect(boardX, boardY, this.canvasUnit, this.canvasUnit);

        // only render fancy shape when tetramino is normal (not ghost)
        if (ttm.type !== 'normal') return;
        this.renderShape(ctx, this.canvasUnit, boardX, boardY, ttm.color);
    }

	public draw() {
		this.drawGrid();
		this.drawCells();
	}

	public drawNext(tetramino: Tetramino) {
		this.nextTetramino = tetramino;

		ctxNext.clearRect(0, 0, UI.next.width, UI.next.width);
		for (let y = 0; y < tetramino.size; y++) {
			for (let x = 0; x < tetramino.size; x++) {
				if (tetramino.get(x, y) == 1) {
					let thisX = x * this.nextUnit,
						thisY = y * this.nextUnit;

					ctxNext.fillStyle = tetramino.color;
					ctxNext.fillRect(thisX, thisY, this.nextUnit, this.nextUnit);

					// only render fancy shape when tetramino is normal (not ghost)
					if (tetramino.type === 'normal') {
						this.renderShape(ctxNext, this.nextUnit, thisX, thisY, tetramino.color);
					}
				}
			}
		}
	}

	public drawPause() {
        this.drawBoardMsg('#000', '#fff', 'GAME PAUSED');
	}

	public drawGameOver() {
        this.drawBoardMsg('yellow', 'red', 'GAME OVER');
	}

    private drawBoardMsg(fillStyle, fillStyle2, text) {
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = fillStyle;
        ctx.fillRect(0, 0, UI.canvas.width, UI.canvas.height);
        ctx.globalAlpha = 1;
        ctx.font = '24px arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = fillStyle2;
        ctx.fillText(text, UI.canvas.width * 0.5, UI.canvas.height * 0.5);
    }
}