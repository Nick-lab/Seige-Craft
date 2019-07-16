import * as Phaser from 'phaser';
export class Test extends Phaser.Scene{
    graphics: Phaser.GameObjects.Graphics;
    player: any;
    hands: any;
    handBones: any = [];
    arms: any = [];
    facing: any = 1;
    debug: any = {};

    preload() {
        this.load.image('player', 'assets/game_assets/characters/skeleton.png');
        this.load.setPath('assets/game_assets/characters');
        (<any>this.load).spine('player', 'skeleton.json', 'skeleton.atlas');
    }

    create() {
        this.graphics = this.add.graphics();
        this.player = (<any>this.add).spine(200, 200, 'player', 'Walk', true);
        this.hands = this.player.findBone('Hands');
        this.handBones.push(this.player.findBone('Left Arm'))
        this.handBones.push(this.player.findBone('Right Arm'))
        this.arms.push(this.player.skeleton.findIkConstraint('Left Arm'))
        this.arms.push(this.player.skeleton.findIkConstraint('Right Arm'))
        console.log(this.player, this.arms, this.hands);
        
        this.debug.circ = new Phaser.Geom.Circle(this.player.x, this.player.y - 50, 5);
        console.log(this.debug.circ);
    }

    update() {
        
        this.updateHands();
        this.graphics.fillStyle(0xFF0000);
        this.graphics.fillCircleShape(this.debug.circ);
    }

    resize() {

    }

    updateHands() {
        let mousePos = {
            x: this.input.activePointer.worldX,
            y: this.input.activePointer.worldY
        }
        let deltaX = mousePos.x - this.debug.circ.x;
        let deltaY = this.debug.circ.y - mousePos.y;
        let radians = Math.atan2(deltaY, deltaX);
        let degrees = (radians * 180 / Math.PI);
        let gunAngle = degrees;
        let preCheck = degrees - 90
        let check = (preCheck < 0 ? preCheck + 360 : preCheck);
        if(check < 360 && check > 180){
            this.player.flipX = false;
            this.facing = 1;
        }else{
            this.player.flipX = true;
            gunAngle = -degrees + 180;
            this.facing = -1;
        }

        let gunPos = {
            x: Math.cos(degrees * Math.PI / 180) * 15,
            y: Math.sin(degrees * Math.PI / 180) * 15 + 50,
        }
        let leftHandPos = {
            x: Math.cos((degrees - 30) * Math.PI / 180) * 12,
            y: Math.sin((degrees - 30) * Math.PI / 180) * 12 + 50,
        }
        let rightHandPos = {
            x: Math.cos((degrees - 3) * Math.PI / 180) * 25,
            y: Math.sin((degrees - 3) * Math.PI / 180) * 25 + 50,
        }
        this.handBones[0].worldX = leftHandPos.x;
        this.handBones[0].worldY = leftHandPos.y;
        this.handBones[1].worldX = rightHandPos.x;
        this.handBones[1].worldY = rightHandPos.y;
        this.arms[0].update();
        this.arms[1].update();
        this.hands.updateWorldTransformWith(0, 0, gunAngle - 90, 1, 1, 0, 0);
        this.hands.worldX = gunPos.x;
        this.hands.worldY = gunPos.y;
    }
    
}