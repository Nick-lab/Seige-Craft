import { Inputs } from "src/_types/common";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";

export class TestScene extends Phaser.Scene {
    graphics!: Phaser.GameObjects.Graphics;
    GRAVITY = 6;
    preload() {
        this.load.image('grid', 'assets/game_assets/debug-grid-1920x1920.png');
    }

    create() {
        this.add.image(0, 0, 'grid').setOrigin(0).setAlpha(0.5);
        this.graphics = this.add.graphics();
        this.cameras.main.zoom = 2;
        this.cameras.main.roundPixels = true;
    }

}