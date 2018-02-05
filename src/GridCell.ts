export class GridCell {
	type: string;
	color: string;

	constructor(config?:any) {
        this.type = config.type || 'empty',
        this.color = config.color || null
	}
}