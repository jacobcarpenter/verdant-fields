import { Phaser } from 'phaser';
import { assets, assetPath, tileTypes } from './constants';
import GroundTile from './groundTile';

const width = 12;
const height = 8;

let game = new Phaser.Game(width * 16, height * 16, Phaser.CANVAS, '', {
	preload,
	create,
	update
});

let selectionIndicator;
let field = [];
let trees = [];

function preload() {
	game.load.path = assetPath,
	game.load
		.image(assets.selection)
		.spritesheet(assets.garden, null, 16, 16);
}

function create() {
	Phaser.Canvas.setImageRenderingCrisp(game.canvas);

	game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	game.scale.setUserScale(4, 4);
	game.scale.refresh();

	const ground = game.add.group();

	selectionIndicator = game.add.image(-1, -1, assets.selection);

	for (let row = 0; row < height; ++row) {
		for (let col = 0; col < width; ++col) {
			const x = 16 * col;
			const y = 16 * row;

			// ground layer
			const tileType = game.rnd.integerInRange(1, 23) === 1 ?
				tileTypes.tilled :
				tileTypes.grass;
			field.push(ground.add(new GroundTile(game, x, y, tileType)));

			// plant a tree?
			if (game.rnd.integerInRange(1, 50) === 1) {
				trees.push(game.add.image(x, y - 2, assets.garden, 0));
			}
		}
	}

	game.input.onDown.add(chopTreeOrPlowField, this);
}

function update() {
	selectionIndicator.x = Math.trunc(game.input.x / 16) * 16;
	selectionIndicator.y = Math.trunc(game.input.y / 16) * 16;
}

function chopTreeOrPlowField() {
	const col = Math.trunc(game.input.x / 16);
	const row = Math.trunc(game.input.y / 16);

	const x = col * 16;
	const y = row * 16;

	let found = trees.findIndex(t => t.x === x && t.y === y - 2);
	if (found !== -1) {
		trees[found].destroy();
		trees.splice(found, 1);
		return;
	}

	const tile = field[row * width + col];
	if (tile.tileType === tileTypes.grass)
		tile.tileType = tileTypes.tilled;
}