/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var UI = exports.UI = {
    canvas: document.getElementById('tetris'),
    next: document.getElementById('next'),
    ratioContainer: document.getElementById('ratioContainer'),
    canvasContainer: document.getElementById('canvasContainer'),
    nextContainer: document.getElementById('nextContainer'),
    score: document.getElementById('score'),
    level: document.getElementById('level'),
    pauseButton: document.getElementById('pauseUnpause'),
    newGameButton: document.getElementById('newGame')
};
var ctx = exports.ctx = UI.canvas.getContext('2d');
var ctxNext = exports.ctxNext = UI.next.getContext('2d');
var config = exports.config = {
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _game = __webpack_require__(2);

_game.game.init();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.game = undefined;

var _config = __webpack_require__(0);

var _Grid = __webpack_require__(3);

var _Board = __webpack_require__(6);

var _Tetramino = __webpack_require__(7);

var _Stats = __webpack_require__(8);

/**
 * Main game object
 */
var game = exports.game = {
    init: function init() {
        this.tetrafactory = new _Tetramino.TetraminosFactory();
        this.grid = new _Grid.Grid();
        this.board = new _Board.Board(this.grid);
        this.stats = new _Stats.Stats(_config.UI.score, _config.UI.level);
        this.movesQueue = [];
        this.events();
        this.newGame();
    },
    gameState: {
        state: '',
        needsRedraw: true,
        dropInterval: _config.config.initialDropInterval,
        lastDropTime: new Date().getTime(),
        timeSinceLastDrop: null
    },
    events: function events() {
        var _this = this;

        document.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 39:
                    _this.movesQueue.push('right');
                    break;
                case 37:
                    _this.movesQueue.push('left');
                    break;
                case 38:
                    _this.movesQueue.push('rotate');
                    break;
                case 40:
                    _this.movesQueue.push('down');
                    break;
                case 32:
                    _this.movesQueue.push('drop');
                    break;
            }
        });
        _config.UI.newGameButton.addEventListener('click', function (e) {
            e.preventDefault();
            _config.UI.newGameButton.blur();
            _this.newGame();
        });
        _config.UI.pauseButton.addEventListener('click', function (e) {
            e.preventDefault();
            if (_this.gameState.state == 'paused') {
                _this.resumeGame();
                _config.UI.pauseButton.classList.remove('active');
            }
            if (_this.gameState.state == 'playing') {
                _this.pauseGame();
                _config.UI.pauseButton.classList.add('active');
            }
            _config.UI.pauseButton.blur();
        });
        window.addEventListener('focus', function () {
            if (_this.gameState.state == 'paused' && !_config.UI.pauseButton.classList.contains('active')) {
                _this.resumeGame();
            }
        });
        window.addEventListener('blur', function () {
            _this.pauseGame();
        });
    },
    newGame: function newGame() {
        this.stats.reset();
        this.gameState.state = 'playing';
        this.grid.reset();
        this.movesQueue = [];
        this.initTetramino();
        this.gameState.dropInterval = _config.config.initialDropInterval;
        this.lastDropTime = new Date().getTime();
        this.gameState.needsRedraw = true;
        this.tick();
    },
    pauseGame: function pauseGame() {
        if (this.gameState.state == 'playing') {
            this.gameState.state = 'paused';
            this.board.drawPause();
        }
    },
    resumeGame: function resumeGame() {
        this.gameState.state = 'playing';
        this.gameState.needsRedraw = true;
        this.gameState.lastDropTime = new Date().getTime();
        this.tick();
    },
    endGame: function endGame() {
        this.movesQueue = [];
        this.gameState.state = 'ended';
        this.gameState.needsRedraw = false;
        this.board.drawGameOver();
    },
    initTetramino: function initTetramino() {
        var dx = void 0,
            dy = void 0,
            dr = void 0;
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
    initGhostTetramino: function initGhostTetramino() {
        this.ghostTetramino = Object.create(this.currentTetramino);
        this.ghostTetramino.color = '#222';
        this.ghostTetramino.type = 'ghost';
        this.positionGhost();
    },
    hintNext: function hintNext() {
        this.board.drawNext(this.tetrafactory.getNextType());
    },
    checkMove: function checkMove(moveType) {
        var dx = 0,
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
    positionGhost: function positionGhost() {
        var dropmove = true,
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
    executeMovesQueue: function executeMovesQueue() {
        var _this2 = this;

        this.movesQueue.every(function (moveType) {
            _this2.movesQueue.shift();
            var canMove = _this2.checkMove(moveType);
            if (canMove) {
                // redraw board;
                _this2.gameState.needsRedraw = true;
                if (moveType == 'down') {
                    _this2.stats.count('down');
                }
                if (moveType == 'tickDown') {
                    _this2.gameState.lastDropTime = new Date().getTime();
                }
            } else {
                if (moveType == 'down' || moveType == 'drop' || moveType == 'tickDown') {
                    // save tetramino to grid
                    _this2.movesQueue = [];
                    _this2.grid.saveTetramino(_this2.currentTetramino);
                    // check full lines
                    var cleared = _this2.grid.clearRows();
                    _this2.stats.countLines(cleared);
                    if (_this2.stats.checkLevelUp()) {
                        _this2.gameState.dropInterval = _this2.gameState.dropInterval > 250 ? _this2.gameState.dropInterval - _this2.stats.level * 15 : 250;
                    }
                    _this2.gameState.needsRedraw = true;
                    // set new tetramino
                    _this2.initTetramino();
                    return false;
                }
            }
        });
    },
    tick: function tick() {
        var self = this,
            timestamp = new Date().getTime();
        // check time and set Tetramino to move down if needed
        var deltaTime = timestamp - this.gameState.lastDropTime;
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
    }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Grid = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(0);

var _Coords = __webpack_require__(4);

var _GridCell = __webpack_require__(5);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = exports.Grid = function () {
    function Grid() {
        _classCallCheck(this, Grid);

        this.width = _config.config.cellsHoriz;
        this.height = _config.config.cellsVert;
        this.space = new Array(_config.config.cellsHoriz * _config.config.cellsVert);
        this.reset();
    }

    _createClass(Grid, [{
        key: 'get',
        value: function get(c) {
            return this.space[c.x + c.y * this.width] || new _GridCell.GridCell({});
        }
    }, {
        key: 'set',
        value: function set(c, cell) {
            this.space[c.x + c.y * this.width] = cell;
        }
    }, {
        key: 'isInside',
        value: function isInside(c) {
            if (c.x < 0 || c.x >= this.width || c.y >= this.height) return false;
            return true;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.space.fill({ type: 'empty', color: null });
        }
    }, {
        key: 'canFit',
        value: function canFit(ttm, dx, dy, dr) {
            var _this = this;

            var size = ttm.size,
                x = ttm.x + dx,
                y = ttm.y + dy,
                rotationArray = ttm.rotations[dr];
            // loop through tetramino array in its new position,
            // check if every tetramino cell is inside grid and that grid cell is empty
            return rotationArray.every(function (val, index) {
                if (val === 0) return true;
                // map current ttm cell to grid.space coords
                var c = new _Coords.Coords(x + index % size, y + Math.floor(index / size));
                if (_this.isInside(c) && _this.get(c).type === 'empty') return true;
                return false;
            });
        }
    }, {
        key: 'saveTetramino',
        value: function saveTetramino(ttm) {
            var _this2 = this;

            var rotationArray = ttm.rotations[ttm.currentRotation],
                x = ttm.x,
                y = ttm.y,
                size = ttm.size;
            rotationArray.forEach(function (val, index) {
                if (val == 0) return;
                // map current ttm cell to grid.space coords
                var c = new _Coords.Coords(x + index % size, y + Math.floor(index / size));
                _this2.set(c, { color: ttm.color, type: 'shape' });
            });
        }
    }, {
        key: 'clearRows',
        value: function clearRows() {
            var cleared = 0;
            var newSpace = [];
            for (var row = 0; row < this.height; row++) {
                var subset = this.space.splice(0, this.width);
                if (subset.some(function (cell) {
                    return cell.type == 'empty';
                })) {
                    newSpace = newSpace.concat(subset);
                } else {
                    cleared++;
                    newSpace = new Array(this.width).fill(new _GridCell.GridCell({})).concat(newSpace);
                }
            }
            this.space = newSpace;
            return cleared;
        }
    }]);

    return Grid;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Coords = exports.Coords = function () {
    function Coords(x, y) {
        _classCallCheck(this, Coords);

        this.x = x;
        this.y = y;
    }

    _createClass(Coords, [{
        key: "plus",
        value: function plus(other) {
            return new Coords(this.x + other.x, this.y + other.y);
        }
    }]);

    return Coords;
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GridCell = exports.GridCell = function GridCell(config) {
    _classCallCheck(this, GridCell);

    this.type = config.type || 'empty', this.color = config.color || null;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Board = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Lighten / Darken Color
 * @url: https://css-tricks.com/snippets/javascript/lighten-darken-color/
 */
function lightenDarkenColor(r, n) {
    r = r.slice(1);var t = parseInt(r, 16),
        a = (t >> 16) + n;a > 255 ? a = 255 : a < 0 && (a = 0);var e = (t >> 8 & 255) + n;e > 255 ? e = 255 : e < 0 && (e = 0);var i = (255 & t) + n;return i > 255 ? i = 255 : i < 0 && (i = 0), "#" + (i | e << 8 | a << 16).toString(16);
}

var Board = exports.Board = function () {
    function Board(grid) {
        _classCallCheck(this, Board);

        this.grid = grid;
        this.redrawAll();
        this.events();
    }

    _createClass(Board, [{
        key: 'events',
        value: function events() {
            var _this = this;

            var resizeTimer = void 0;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    _this.redrawAll();
                }, 250);
            });
        }
    }, {
        key: 'redrawAll',
        value: function redrawAll() {
            _config.UI.canvas.width = _config.UI.canvas.height = 0;
            _config.UI.next.width = _config.UI.next.height = 0;
            this.setCanvas();
            this.draw();
            if (!this.tetramino) return;
            this.drawTetramino(this.tetramino);
            this.drawNext(this.nextTetramino);
        }
    }, {
        key: '_getRatio',
        value: function _getRatio() {
            var h = _config.UI.canvasContainer.clientHeight;
            return h / _config.config.canvasHeigth;
        }
    }, {
        key: 'setCanvas',
        value: function setCanvas() {
            var sw = window.innerWidth - 30,
                sh = window.innerHeight - 40,
                sRatio = sw / sh;
            var gameBoardRatio = 0.7;
            if (sRatio > gameBoardRatio) {
                _config.UI.ratioContainer.style.height = sh + 'px';
                _config.UI.ratioContainer.style.width = sh * gameBoardRatio + 'px';
            } else {
                _config.UI.ratioContainer.style.width = sw + 'px';
                _config.UI.ratioContainer.style.height = sw / gameBoardRatio + 'px';
            }
            this.ratio = this._getRatio();
            this.canvasUnit = Math.round(_config.config.canvasCellSize * this.ratio);
            _config.UI.canvas.width = this.canvasUnit * _config.config.cellsHoriz;
            _config.UI.canvas.height = this.canvasUnit * _config.config.cellsVert;
            // next tetramino canvas
            this.nextUnit = Math.round(_config.UI.nextContainer.clientWidth / 4);
            _config.UI.next.width = this.nextUnit * 4;
            _config.UI.next.height = this.nextUnit * 2;
        }
    }, {
        key: 'drawGrid',
        value: function drawGrid() {
            _config.ctx.clearRect(0, 0, _config.UI.canvas.width, _config.UI.canvas.height);
            _config.ctx.save();
            _config.ctx.translate(0.5, 0.5);
            _config.ctx.beginPath();
            _config.ctx.lineWidth = 1;
            for (var i = 1; i <= this.grid.height; i++) {
                _config.ctx.moveTo(0, i * this.canvasUnit);
                _config.ctx.lineTo(_config.UI.canvas.width, i * this.canvasUnit);
            }
            for (var _i = 1; _i <= this.grid.width; _i++) {
                _config.ctx.moveTo(_i * this.canvasUnit, 0);
                _config.ctx.lineTo(_i * this.canvasUnit, _config.UI.canvas.height);
            }
            _config.ctx.strokeStyle = '#444';
            _config.ctx.stroke();
            _config.ctx.closePath();
            _config.ctx.restore();
        }
    }, {
        key: 'renderShape',
        value: function renderShape(ctx, unit, x, y, color) {
            var lighterColor = lightenDarkenColor(color, 30),
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
    }, {
        key: 'drawCells',
        value: function drawCells() {
            var _this2 = this;

            this.grid.space.forEach(function (cell, index) {
                var x = index % _this2.grid.width * _this2.canvasUnit;
                var y = Math.floor(index / _this2.grid.width) * _this2.canvasUnit;
                if (cell.type == 'empty') return;
                _this2.renderShape(_config.ctx, _this2.canvasUnit, x, y, cell.color);
            });
        }
    }, {
        key: 'drawTetramino',
        value: function drawTetramino(ttm) {
            var _this3 = this;

            // save local reference to current tetramino instance
            this.tetramino = ttm;
            ttm.rotations[ttm.currentRotation].forEach(function (cell, index) {
                if (!cell) return;
                _this3.drawTetraminoCell(cell, index, ttm);
            });
        }
    }, {
        key: 'drawTetraminoCell',
        value: function drawTetraminoCell(cell, index, ttm) {
            var cellX = index % ttm.size,
                cellY = Math.floor(index / ttm.size),
                boardX = (ttm.x + cellX) * this.canvasUnit,
                boardY = (ttm.y + cellY) * this.canvasUnit;
            _config.ctx.fillStyle = ttm.color;
            _config.ctx.fillRect(boardX, boardY, this.canvasUnit, this.canvasUnit);
            // only render fancy shape when tetramino is normal (not ghost)
            if (ttm.type !== 'normal') return;
            this.renderShape(_config.ctx, this.canvasUnit, boardX, boardY, ttm.color);
        }
    }, {
        key: 'draw',
        value: function draw() {
            this.drawGrid();
            this.drawCells();
        }
    }, {
        key: 'drawNext',
        value: function drawNext(tetramino) {
            this.nextTetramino = tetramino;
            _config.ctxNext.clearRect(0, 0, _config.UI.next.width, _config.UI.next.width);
            for (var y = 0; y < tetramino.size; y++) {
                for (var x = 0; x < tetramino.size; x++) {
                    if (tetramino.get(x, y) == 1) {
                        var thisX = x * this.nextUnit,
                            thisY = y * this.nextUnit;
                        _config.ctxNext.fillStyle = tetramino.color;
                        _config.ctxNext.fillRect(thisX, thisY, this.nextUnit, this.nextUnit);
                        // only render fancy shape when tetramino is normal (not ghost)
                        if (tetramino.type === 'normal') {
                            this.renderShape(_config.ctxNext, this.nextUnit, thisX, thisY, tetramino.color);
                        }
                    }
                }
            }
        }
    }, {
        key: 'drawPause',
        value: function drawPause() {
            this.drawBoardMsg('#000', '#fff', 'GAME PAUSED');
        }
    }, {
        key: 'drawGameOver',
        value: function drawGameOver() {
            this.drawBoardMsg('yellow', 'red', 'GAME OVER');
        }
    }, {
        key: 'drawBoardMsg',
        value: function drawBoardMsg(fillStyle, fillStyle2, text) {
            _config.ctx.globalAlpha = 0.7;
            _config.ctx.fillStyle = fillStyle;
            _config.ctx.fillRect(0, 0, _config.UI.canvas.width, _config.UI.canvas.height);
            _config.ctx.globalAlpha = 1;
            _config.ctx.font = '24px arial';
            _config.ctx.textAlign = 'center';
            _config.ctx.fillStyle = fillStyle2;
            _config.ctx.fillText(text, _config.UI.canvas.width * 0.5, _config.UI.canvas.height * 0.5);
        }
    }]);

    return Board;
}();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var shapes = {
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
};
/**
 * Tetramino constructor
 */

var Tetramino = exports.Tetramino = function () {
    /**
     * Creates an instance of Tetramino.
     */
    function Tetramino(config) {
        _classCallCheck(this, Tetramino);

        this.x = config.x || 0;
        this.y = config.y || 0;
        this.color = config.color;
        this.rotations = config.rotations;
        this.currentRotation = 0;
        this.size = config.size;
        this.type = config.type || 'normal';
        this.shape = config.shape;
    }

    _createClass(Tetramino, [{
        key: 'get',
        value: function get(x, y) {
            return this.rotations[this.currentRotation][x + y * this.size];
        }
    }]);

    return Tetramino;
}();
/**
 * Factory class for creating Tetramino instances of given shape
 */


var TetraminosFactory = exports.TetraminosFactory = function () {
    function TetraminosFactory() {
        _classCallCheck(this, TetraminosFactory);

        this.bag = this.fillBag();
    }
    /**
     * Returns the Tetramino instance for given shape id
     */


    _createClass(TetraminosFactory, [{
        key: 'create',
        value: function create(type) {
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
    }, {
        key: 'createRandom',
        value: function createRandom() {
            if (this.bag.length == 0) {
                this.bag = this.fillBag();
            }
            return this.create(this.bag.shift());
        }
    }, {
        key: 'getNextType',
        value: function getNextType() {
            if (this.bag.length == 0) {
                this.bag = this.fillBag();
            }
            return this.create(this.bag[0]);
        }
    }, {
        key: 'fillBag',
        value: function fillBag() {
            var shapes = ['I', 'J', 'L', 'O', 'S', 'Z', 'T'];
            shapes.sort(function (a, b) {
                return 0.5 - Math.random();
            });
            return shapes;
        }
        /**
         * Returns right side rotation of given array
         */

    }, {
        key: '_rotateShape',
        value: function _rotateShape(shape) {
            var len = Math.sqrt(shape.length);
            var rotation = [];
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len; j++) {
                    rotation[len - i - 1 + j * len] = shape[j + i * len];
                }
            }
            return rotation;
        }
        /**
         * Generates all 4 rotations for given shape type
         */

    }, {
        key: '_generateRotations',
        value: function _generateRotations(type) {
            var rotations = [];
            rotations.push(shapes[type.toUpperCase()].shapeMap);
            for (var i = 0; i < 3; i++) {
                var rotation = this._rotateShape(rotations[i]);
                rotations.push(rotation);
            }
            return rotations;
        }
    }]);

    return TetraminosFactory;
}();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var basePoints = {
    down: 1,
    clearline: 100,
    drop: 15
};

var Stats = exports.Stats = function () {
    function Stats(scoreUI, levelUI) {
        _classCallCheck(this, Stats);

        this.scoreUI = scoreUI;
        this.levelUI = levelUI;
        this.level = 1;
        this.score = 0;
        this.cleared = 0;
        this.level = 1;
        this.score = 0;
    }

    _createClass(Stats, [{
        key: "reset",
        value: function reset() {
            this.level = 1;
            this.score = 0;
            this.drawLevel();
            this.drawScore();
        }
    }, {
        key: "count",
        value: function count(type) {
            if (!basePoints[type]) {
                return;
            }
            this.score += basePoints[type] * this.level;
            this.drawScore();
            this.drawLevel();
        }
    }, {
        key: "countLines",
        value: function countLines(count) {
            this.cleared += count;
            this.score += this.level * basePoints.clearline * count * count;
            this.drawScore();
            // this.checkLevelUp();
            this.drawLevel();
        }
    }, {
        key: "checkLevelUp",
        value: function checkLevelUp() {
            // console.log('cleared: ' + this.cleared);
            var level = Math.floor(this.cleared / 10) + 1;
            if (level != this.level) {
                // console.log('IS LEVEL UP');
                this.level = level;
                return true;
            }
            // console.log('level: ' + this.level);
            return false;
        }
    }, {
        key: "drawScore",
        value: function drawScore() {
            this.scoreUI.innerHTML = this.score.toString();
        }
    }, {
        key: "drawLevel",
        value: function drawLevel() {
            this.levelUI.innerHTML = this.level.toString();
        }
    }]);

    return Stats;
}();

/***/ })
/******/ ]);