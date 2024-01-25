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

    }

    create() {
        console.log(this.physics.getConfig());
        
        this.inputs = {
            'up': this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            'left': this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            'down': this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            'right': this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            'space': this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        }

        let player = this.player = new Player(this, this.inputs);
        player.create();
        this.entities.push(player);
        
    }

    override update() {
        for(let e of this.entities) e.update();
    }
}