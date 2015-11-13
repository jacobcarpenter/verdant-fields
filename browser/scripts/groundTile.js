import { Phaser } from 'phaser';
import { assets, tileTypes } from './constants';

const tileTypeToFrame = {
	[tileTypes.grass]: 17,
	[tileTypes.partlyTilled]: 21,
	[tileTypes.tilled]: 16,
}

export default class GroundTile extends Phaser.Image {
	constructor(game, x, y, tileType) {
		super(game, x, y, assets.garden, tileTypeToFrame[tileType]);
		this._tileType = tileType;
	}

	get tileType() {
		return this._tileType;
	}
	set tileType(value) {
		this.frame = tileTypeToFrame[value];
		this._tileType = value;
	}
}