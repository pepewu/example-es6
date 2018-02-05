let basePoints = {
	down: 1,
	clearline: 100,
	drop: 15
};

export class Stats {
	level: number = 1;
	score: number = 0;
	cleared: number = 0;

	constructor(public scoreUI: HTMLElement, public levelUI: HTMLElement) {
		this.level = 1;
		this.score = 0;
	}

	reset() {
		this.level = 1;
		this.score = 0;

		this.drawLevel();
		this.drawScore();
	}

	count(type: string) {
		if (!basePoints[type]) {
			return;
		}

		this.score += basePoints[type] * this.level;
		this.drawScore();
		this.drawLevel();
	}

	countLines(count) {
		this.cleared += count;
		this.score += this.level * basePoints.clearline * count * count;
		this.drawScore();
		// this.checkLevelUp();
		this.drawLevel();
	}

	checkLevelUp(): boolean {
		// console.log('cleared: ' + this.cleared);
		let level = Math.floor(this.cleared / 10) + 1;
		if (level != this.level) {
			// console.log('IS LEVEL UP');
			this.level = level;
			return true;
		}
		// console.log('level: ' + this.level);
		return false;
	}

	drawScore() {
		this.scoreUI.innerHTML = this.score.toString();
	}

	drawLevel() {
		this.levelUI.innerHTML = this.level.toString();
	}
}