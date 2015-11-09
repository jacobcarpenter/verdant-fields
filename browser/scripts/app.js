import { Phaser } from 'phaser';

const width = 12;
const height = 8;

let game = new Phaser.Game(width * 16, height * 16, Phaser.CANVAS, '', {
	preload,
	create,
	update
});

let selectionIndicator;

function preload() {
	game.load.path = 'assets/';
	game.load
		.image('selection')
		.spritesheet('garden', null, 16, 16);
}

function create() {
	Phaser.Canvas.setImageRenderingCrisp(game.canvas);

	game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	game.scale.setUserScale(4, 4);
	game.scale.refresh();

	const ground = game.add.group();
	ground.classType = Phaser.Image;

	selectionIndicator = game.add.image(-1, -1, 'selection');

	for (let row = 0; row < height; ++row) {
		for (let col = 0; col < width; ++col) {
			const x = 16 * col;
			const y = 16 * row;

			// ground layer
			const spriteRow = game.rnd.integerInRange(1, 23) === 1 ? 5 : 4;
			ground.create(x, y, 'garden', spriteRow * 4 + 1);

			// plant a tree?
			if (game.rnd.integerInRange(1, 50) === 1) {
				game.add.image(x, y - 2, 'garden', 0);
			}
		}
	}

}

function update() {
	const selectionOriginX = Math.trunc(game.input.x / 16) * 16;
	const selectionOriginY = Math.trunc(game.input.y / 16) * 16;

	selectionIndicator.x = selectionOriginX;
	selectionIndicator.y = selectionOriginY;
}
