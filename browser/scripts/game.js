import { Phaser } from 'phaser';
import { assetPath, assets, dimensions, tileSize, tileTypes } from './constants';
import GroundTile from './groundTile';

export default class extends Phaser.State {
	constructor() {
		super();
		this.selectionIndicator = null;
		this.ground = null;
		this.trees = null;
	}

	preload() {
		this.game.load.path = assetPath,
		this.game.load
			.image(assets.selection)
			.spritesheet(assets.garden, null, tileSize, tileSize);
	}

	create() {
		this.ground = this.game.add.group();
		this.selectionIndicator = this.game.add.image(-1, -1, assets.selection);
		this.trees = this.game.add.group();

		for (let row = 0; row < dimensions.height; ++row) {
			for (let col = 0; col < dimensions.width; ++col) {
				const x = col * tileSize;
				const y = row * tileSize;

				// ground layer
				const tileType = this.game.rnd.integerInRange(1, 23) === 1 ?
					tileTypes.tilled :
					tileTypes.grass;
				this.ground.add(new GroundTile(this.game, x, y, tileType));

				// plant a tree?
				if (tileType === tileTypes.grass && this.game.rnd.integerInRange(1, 43) === 1) {
					this.trees.create(x, y - 2, assets.garden, 0);
				}
			}
		}

		this.game.input.onDown.add(this.handleClick, this);
	}

	update() {
		const bounds = getContainingTileBounds(this.game.input);
		this.selectionIndicator.x = bounds.x;
		this.selectionIndicator.y = bounds.y;
	}

	handleClick() {
		const bounds = getContainingTileBounds(this.game.input);
		let found = this.trees.children.find(t => bounds.contains(t.x, t.bottom));
		if (found) {
			found.destroy();
			return;
		}

		const col = Math.trunc(bounds.x / tileSize);
		const row = Math.trunc(bounds.y / tileSize);
		const tile = this.ground.getAt(row * dimensions.width + col);
		if (tile.tileType === tileTypes.grass)
			tile.tileType = tileTypes.tilled;
	}
}

function getContainingTileBounds({ x, y }) {
	return new Phaser.Rectangle(
		Math.trunc(x / tileSize) * tileSize,
		Math.trunc(y / tileSize) * tileSize,
		tileSize, tileSize);
}
