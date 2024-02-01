import { Inputs } from "src/_types/common";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { Entity } from "../entity";
import { Player } from "../player";

export class TestScene extends Phaser.Scene {
    rexUI!: RexUIPlugin;
    entities: Array<Entity> = [];
    player!: Player;

    inputs: Inputs = {};

    constructor() {
        super({});
    }

    preload() {
        let camera = this.cameras.main;

        // Preload necessary assets.
        this.load.atlas('flares', 'assets/flares.png', 'assets/flares.json');
        // this.add.text(camera.width / 2, camera.height / 2, "Game", {
        //     fontSize: 20,
        //     align: 'center',
            
        // });
        this.load.atlas('guy', 'assets/guy_walking.png', 'assets/guy_walking.json');
        this.load.atlas('dude', 'assets/walking_anim.png', 'assets/walking_anim.json');
    }

    create() {
        console.log(this.physics.getConfig());
        
        this.inputs = {
            'up': this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            'left': this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            'down': this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            'right': this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            'space': this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            'shift': this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
        }

        let player = this.player = new Player(this, this.inputs);
        this.entities.push(player);
        
    }

    override update() {
        for(let e of this.entities) e.update();
    }
}