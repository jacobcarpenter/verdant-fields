import { Phaser } from 'phaser';
import { states } from './constants';

export default class Boot extends Phaser.State {
	create() {
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

		this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
		this.game.scale.setUserScale(4, 4);
		this.game.scale.refresh();

		this.game.state.start(states.game);
	}
}