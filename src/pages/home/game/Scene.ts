import * as Phaser from 'phaser';
import { Player } from './Player';
import { Guns } from './Guns';
export class Scene extends Phaser.Scene{
    graphics: Phaser.GameObjects.Graphics;
    cursors: any;
    GRAVITY = 6;
    player: Player;
    shots = [];
    bullets;
    guns: Guns;

    preload() {
        this.load.image('player', 'assets/game_assets/characters/skeleton.png');
        this.load.image('grid', 'assets/game_assets/debug-grid-1920x1920.png');
        this.load.audio('rifle', 'assets/game_assets/sounds/effects/Rifle.wav');
        this.load.audio('pistol', 'assets/game_assets/sounds/effects/Pistol.wav');
        this.load.setPath('assets/game_assets/characters');
        (<any>this.load).spine('player', 'skeleton.json', 'skeleton.atlas');
    }

    create() {
        this.graphics = this.add.graphics();
        this.add.image(0, 0, 'grid').setOrigin(0).setAlpha(0.5);
        this.guns = new Guns();
        this.player = new Player(this.guns);
        this.player.init({parent: this});
        this.cursors = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D,
            reload_gun: Phaser.Input.Keyboard.KeyCodes.R,
            switch_gun: Phaser.Input.Keyboard.KeyCodes.F,
            crouch:Phaser.Input.Keyboard.KeyCodes.CTRL,
            running:Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

        this.bullets = this.add.group();

        this.game.events.addListener('destroy', ()=>{
            this.player.spine.destroy();
        })

        this.cursors.reload_gun.onDown = () => {
            this.player.reloadGun();
        }

        this.cursors.switch_gun.onDown = () => {
            this.player.switchGun();
        }


        this.cameras.main.setBounds(0, 0, 1920, 1920);
        this.cameras.main.startFollow(this.player.spine, true, 0.09, 0.09, 0 , 60);
        this.cameras.main.roundPixels = true;
        
    }

    update(time, delta) {
        this.graphics.clear()
        if(this.shots.length > 15) this.shots.pop();
        let mousePos = {
            x: this.input.activePointer.x + this.cameras.main.scrollX,
            y: this.input.activePointer.y + this.cameras.main.scrollY
        }
        this.player.update({
            mousePos,
            delta,
            cursors: this.cursors
        })
        this.graphics.lineStyle(1, 0xff0000, 1);
        this.shots.forEach((shot:Phaser.Curves.Path)=>{
            shot.draw(this.graphics);
        })
    }

    addShot(shot) {
        this.shots.unshift(shot);
    }
}