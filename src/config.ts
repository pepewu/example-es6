export let UI = {
	canvas: <HTMLCanvasElement>document.getElementById('tetris'),
	next: <HTMLCanvasElement>document.getElementById('next'),
	ratioContainer: document.getElementById('ratioContainer'),
	canvasContainer: document.getElementById('canvasContainer'),
	nextContainer: document.getElementById('nextContainer'),
	score: document.getElementById('score'),
	level: document.getElementById('level'),
	pauseButton: document.getElementById('pauseUnpause'),
	newGameButton: document.getElementById('newGame')
};

export let ctx = UI.canvas.getContext('2d');
export let ctxNext = UI.next.getContext('2d');

export let config = {
	initialDropInterval: 1000,
	cellsHoriz: 10,
	cellsVert: 20,
	canvasWidth: 200,
	canvasHeigth: 400,
	canvasCellSize: 20,
	nextWidth: 80,
	nextHeight: 80,
	nextCellSize: 20
};