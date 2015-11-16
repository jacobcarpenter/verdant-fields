import { Phaser } from 'phaser';
import { assetPath, assets, dimensions, tileSize, tileTypes } from './constants';
import GroundTile from './groundTile';

export default class Game extends Phaser.State {
	constructor() {
		super();
		this.selectionIndicator = null;
		this.ground = null;
		this.trees = null;
	}

	preload() {
		this.load.path = assetPath,
		this.load
			.image(assets.selection)
			.spritesheet(assets.garden, null, tileSize, tileSize);
	}

	create() {
		this.ground = this.add.group();
		this.selectionIndicator = this.add.image(-1, -1, assets.selection);
		this.trees = this.add.group();

		for (let row = 0; row < dimensions.height; ++row) {
			for (let col = 0; col < dimensions.width; ++col) {
				const x = col * tileSize;
				const y = row * tileSize;

				// ground layer
				const tileType = this.rnd.integerInRange(1, 23) === 1 ?
					tileTypes.partlyTilled :
					tileTypes.grass;
				this.ground.add(new GroundTile(this.game, x, y, tileType));

				// plant a tree?
				if (tileType === tileTypes.grass && this.rnd.integerInRange(1, 43) === 1) {
					this.trees.create(x, y - 2, assets.garden, 0);
				}
			}
		}

		this.input.onDown.add(this.handleClick, this);
	}

	update() {
		const bounds = getContainingTileBounds(this.input);
		this.selectionIndicator.x = bounds.x;
		this.selectionIndicator.y = bounds.y;
	}

	handleClick() {
		const bounds = getContainingTileBounds(this.input);
		let found = this.trees.children.find(t => bounds.contains(t.x, t.bottom));
		if (found) {
			found.destroy();
			return;
		}

		const col = Math.trunc(bounds.x / tileSize);
		const row = Math.trunc(bounds.y / tileSize);
		const tile = getAt.call(this, row, col);
		switch (tile.tileType) {
		case tileTypes.grass:
			tile.tileType = tileTypes.partlyTilled;
			break;
		case tileTypes.partlyTilled:
			tile.tileType = tileTypes.tilled;
			updateSurroundingTiles.call(this, row, col);
			break;
		}
	}
}

function getContainingTileBounds({ x, y }) {
	return new Phaser.Rectangle(
		Math.trunc(x / tileSize) * tileSize,
		Math.trunc(y / tileSize) * tileSize,
		tileSize, tileSize);
}

function updateTile(row, col) {
	let tile = getAt.call(this, row, col);
	if (!tile)
		return;

	if (tile.tileType !== tileTypes.tilled) {
		// look at neighbors to see if we change
		const n = isTilled.call(this, row-1, col);
		const s = isTilled.call(this, row+1, col);
		const w = isTilled.call(this, row, col-1);
		const e = isTilled.call(this, row, col+1);
		const nw = isTilled.call(this, row-1, col-1);
		const ne = isTilled.call(this, row-1, col+1);
		const sw = isTilled.call(this, row+1, col-1);
		const se = isTilled.call(this, row+1, col+1);

		if (n && s || e && w || n && e && sw || n && w && se || s && e && nw || s && w && ne) {
			tile.tileType = tileTypes.tilled;
			updateSurroundingTiles.call(this, row, col);
		}
		else if (n || s || e || w || nw || ne || sw || se) {
			tile.tileType = tileTypes.partlyTilled;

			// override the frame
			if (n && e || n && se || e && nw) {
				tile.frame = 28;
			}
			else if (n && w || n && sw || w && ne) {
				tile.frame = 29;
			}
			else if (s && e || s && ne || e && sw) {
				tile.frame = 24;
			}
			else if (s && w || s && nw || w && se) {
				tile.frame = 25;
			}
			else if (n) {
				tile.frame = 31;
			}
			else if (s) {
				tile.frame = 27;
			}
			else if (e) {
				tile.frame = 26;
			}
			else if (w) {
				tile.frame = 30;
			}
			else if (nw && se) {
				tile.frame = 32;
			}
			else if (ne && sw) {
				tile.frame = 33;
			}
			else if (nw) {
				tile.frame = 23;
			}
			else if (ne) {
				tile.frame = 22;
			}
			else if (sw) {
				tile.frame = 19;
			}
			else if (se) {
				tile.frame = 18;
			}
		}
	}
}

function updateSurroundingTiles(row, col) {
	for (let rowOffset of [-1, 0, 1]) {
		for (let colOffset of [-1, 0, 1]) {
			if (rowOffset === 0 && colOffset === 0)
				continue;

			updateTile.call(this, row+rowOffset, col+colOffset);
		}
	}
}

function isTilled(row, col) {
	const tile = getAt.call(this, row, col);
	return tile && tile.tileType === tileTypes.tilled;
}

function getAt(row, col) {
	if (row < 0 || col < 0 || row >= dimensions.height || col >= dimensions.width)
		return null;

	const tile = this.ground.getAt(row * dimensions.width + col);
	return tile !== -1 ? tile : null;
}