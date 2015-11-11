import { Phaser } from 'phaser';
import { assets, assetPath, tileSize, tileTypes } from './constants';
import GroundTile from './groundTile';

const width = 12;
const height = 8;

let game = new Phaser.Game(width * tileSize, height * tileSize, Phaser.CANVAS, 'game-container', {
	preload,
	create,
	update
});

let selectionIndicator;
let ground;
let trees;

function preload() {
	game.load.path = assetPath,
	game.load
		.image(assets.selection)
		.spritesheet(assets.garden, null, tileSize, tileSize);
}

function create() {
	Phaser.Canvas.setImageRenderingCrisp(game.canvas);

	game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	game.scale.setUserScale(4, 4);
	game.scale.refresh();

	ground = game.add.group();
	selectionIndicator = game.add.image(-1, -1, assets.selection);
	trees = game.add.group();

	for (let row = 0; row < height; ++row) {
		for (let col = 0; col < width; ++col) {
			const x = col * tileSize;
			const y = row * tileSize;

			// ground layer
			const tileType = game.rnd.integerInRange(1, 23) === 1 ?
				tileTypes.tilled :
				tileTypes.grass;
			ground.add(new GroundTile(game, x, y, tileType));

			// plant a tree?
			if (tileType === tileTypes.grass && game.rnd.integerInRange(1, 43) === 1) {
				trees.create(x, y - 2, assets.garden, 0);
			}
		}
	}

	game.input.onDown.add(chopTreeOrPlowField, this);
}

function update() {
	const bounds = getContainingTileBounds(game.input);
	selectionIndicator.x = bounds.x;
	selectionIndicator.y = bounds.y;
}

function chopTreeOrPlowField() {
	const bounds = getContainingTileBounds(game.input);
	let found = trees.children.find(t => bounds.contains(t.x, t.bottom));
	if (found) {
		found.destroy();
		return;
	}

	const col = Math.trunc(bounds.x / tileSize);
	const row = Math.trunc(bounds.y / tileSize);
	const tile = ground.getAt(row * width + col);
	if (tile.tileType === tileTypes.grass)
		tile.tileType = tileTypes.tilled;
}

function getContainingTileBounds({ x, y }) {
	return new Phaser.Rectangle(
		Math.trunc(x / tileSize) * tileSize,
		Math.trunc(y / tileSize) * tileSize,
		tileSize, tileSize);
}
