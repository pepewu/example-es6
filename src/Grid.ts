import { UI, config } from './config';
import { Coords } from './Coords';
import { GridCell } from './GridCell';
import { Tetramino } from './Tetramino';

export class Grid {
    width: number;
    height: number;
    space: GridCell[];

    constructor() {
        this.width = config.cellsHoriz;
        this.height = config.cellsVert;
        this.space = new Array(config.cellsHoriz * config.cellsVert);

        this.reset();
    }

    public get(c: Coords): GridCell {
        return this.space[c.x + c.y * this.width] || new GridCell({});
    }

    public set(c: Coords, cell: GridCell): void {
        this.space[c.x + c.y * this.width] = cell;
    }

    public isInside(c: Coords): boolean {
        if ( c.x < 0 || c.x >= this.width || c.y >= this.height ) return false;
        return true;
    }

    private reset(): void {
        this.space.fill({ type: 'empty', color: null });
    }

    public canFit(ttm: Tetramino, dx: number, dy: number, dr: number): boolean {
        let size = ttm.size,
            x = ttm.x + dx,
            y = ttm.y + dy,
            rotationArray = ttm.rotations[dr];

        // loop through tetramino array in its new position,
        // check if every tetramino cell is inside grid and that grid cell is empty
        return rotationArray.every((val, index) => {
            if (val === 0) return true;

            // map current ttm cell to grid.space coords
            let c = new Coords(x + (index % size), y + Math.floor(index / size));

            if (this.isInside(c) && this.get(c).type === 'empty') return true;
            return false;
        });
    }

    public saveTetramino(ttm: Tetramino): void {
        let rotationArray = ttm.rotations[ttm.currentRotation],
            x = ttm.x,
            y = ttm.y,
            size = ttm.size;

        rotationArray.forEach((val, index) => {
            if (val == 0) return;

            // map current ttm cell to grid.space coords
            let c = new Coords(x + (index % size), y + Math.floor(index / size));
            this.set(c, { color: ttm.color, type: 'shape' });
        });
    }

    public clearRows(): number {
        let cleared = 0;
        let newSpace = [];

        for (let row = 0; row < this.height; row++) {
            let subset = this.space.splice(0, this.width);
            if (subset.some(cell => cell.type == 'empty')) {
                newSpace = newSpace.concat(subset);
            } else {
                cleared++;
                newSpace = new Array(this.width)
                    .fill(new GridCell({}))
                    .concat(newSpace);
            }
        }

        this.space = newSpace;
        return cleared;
    }
}