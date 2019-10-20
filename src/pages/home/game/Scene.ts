import Phaser from 'phaser';
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
    light: Phaser.GameObjects.Light[] = [];
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
        this.player.init({parent: this, graphics: this.graphics});
        this.cursors = this.input.keyboard.addKeys({
            up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D,
            reload_gun: Phaser.Input.Keyboard.KeyCodes.R,
            switch_gun: Phaser.Input.Keyboard.KeyCodes.F,
            crouch:Phaser.Input.Keyboard.KeyCodes.CTRL,
            running:Phaser.Input.Keyboard.KeyCodes.SHIFT,
            in: Phaser.Input.Keyboard.KeyCodes.PERIOD,
            out: Phaser.Input.Keyboard.KeyCodes.COMMA,
        });

        this.light.push(this.lights.addLight(200, 200, 200));
        this.lights.enable().setAmbientColor(0x555555);

        this.bullets = this.add.group();

        this.game.events.addListener('destroy', ()=>{
            this.player.spine.destroy();
        });

        this.cursors.reload_gun.onDown = () => {
            this.player.reloadGun();
        }

        this.cursors.switch_gun.onDown = () => {
            this.player.switchGun();
        }

        // // zoom camera
        // this.cursors.in.onDown = () => {
        //     let z = -.02;
        //     if(this.cameras.main.zoom + z >= 1){
        //         this.cameras.main.zoom = this.cameras.main.zoom + z;
        //     }
            
        // }
        // this.cursors.out.onDown = () => {
        //     let z = .02;
        //     if(this.cameras.main.zoom + z <= 2){
        //         this.cameras.main.zoom = this.cameras.main.zoom + z;
        //     }
        // }


        this.cameras.main.zoom = 2;
        this.cameras.main.setBounds(0, 0, 1920, 1920);
        this.cameras.main.startFollow(this.player.follow, true, 0.09, 0.09, 0, 0);
        this.cameras.main.roundPixels = true;
        
    }

    update(time, delta) {
        // clear graphics globally 
        this.graphics.clear()
        if(this.shots.length > 15) this.shots.pop();
        // update mouse world position to fix moving and mouse position not updating with camera
        this.input.activePointer.updateWorldPoint(this.cameras.main);
        //console.log(mousePos);
        // pass update onto player object will update other players later
        this.player.update({
            mousePos: {
                x: (this.input.activePointer.worldX),
                y: (this.input.activePointer.worldY)
            },
            delta,
            cursors: this.cursors
        });
        // update camera zoom
        this.cameras.main.zoom = this.player.follow.zoom;
        // set line style for graphics
        this.graphics.lineStyle(1, 0xff0000, 1);
        // draw shots on screen debug purposes
        this.shots.forEach((shot:Phaser.Curves.Path)=>{
            shot.draw(this.graphics);
        })
    }

    addShot(shot) {
        // push shot to start of array
        this.shots.unshift(shot);
    }
}