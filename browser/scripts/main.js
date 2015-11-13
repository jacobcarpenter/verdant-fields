import { Phaser } from 'phaser';
import { dimensions, states, tileSize } from './constants';
import Boot from './boot';
import Game from './game';

const game = new Phaser.Game(
	dimensions.width * tileSize,
	dimensions.height * tileSize,
	Phaser.CANVAS,
	'game-container');

game.state.add(states.boot, Boot);
game.state.add(states.game, Game);

game.state.start(states.boot);
