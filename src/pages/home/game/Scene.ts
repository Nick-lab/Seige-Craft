import * as Phaser from 'phaser';
export class Test extends Phaser.Scene{
    graphics: Phaser.GameObjects.Graphics;
    player: any;
    hands: any;
    handBones: any = [];
    arms: any = [];
    facing: any = 1;
    debug: any = {};
    cursors: any ;
    backSpeed = 5;
    speed = 8.5;
    phase = '';
    preload() {
        this.load.image('player', 'assets/game_assets/characters/skeleton.png');
        this.load.setPath('assets/game_assets/characters');
        (<any>this.load).spine('player', 'skeleton.json', 'skeleton.atlas');
    }

    create() {
        this.graphics = this.add.graphics();
        this.player = (<any>this.add).spine(200, 200, 'player', 'Idle', true);
        this.hands = this.player.findBone('Hands');
        this.handBones.push(this.player.findBone('Left Arm'))
        this.handBones.push(this.player.findBone('Right Arm'))
        this.arms.push(this.player.skeleton.findIkConstraint('Left Arm'))
        this.arms.push(this.player.skeleton.findIkConstraint('Right Arm'))
        this.cursors = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D});

        console.log(this.cursors, this.player);

        this.cameras.main.setBounds(0, 0, 1024, 2048);

        this.cameras.main.startFollow(this.player, true, 0.09, 0.09, 0 , 50);
        // this.cameras.main.roundPixels = true;

        this.cameras.main.setZoom(2);
    }

    update(time, delta) {
        let deltaTime = delta / 100;
        if(this.cursors.left.isDown){
            let nSpeed = this.facing > 0 ? this.backSpeed : this.speed;
            this.player.x -= nSpeed * deltaTime;
            if(this.phase != 'Walk') {
                this.player.play('Walk', true);
                this.phase = 'Walk';
            }
        }else if(!this.cursors.right.isDown){
            if(this.phase != 'Idle') {
                this.player.play('Idle', true);
                this.phase = 'Idle';
            }
        }
        if(this.cursors.right.isDown){
            let nSpeed = this.facing < 0 ? this.backSpeed : this.speed;
            this.player.x += nSpeed * deltaTime;
            if(this.phase != 'Walk') {
                this.player.play('Walk', true);
                this.phase = 'Walk';
            }
        }else if(!this.cursors.left.isDown){
            if(this.phase != 'Idle') {
                this.player.play('Idle', true);
                this.phase = 'Idle';
            }
        }
        this.updateHands();
    }

    resize() {

    }

    updateHands() {
        let mousePos = {
            x: this.input.activePointer.worldX,
            y: this.input.activePointer.worldY
        }
        
        if(mousePos.x > this.player.x){
            this.player.flipX = false;
            this.facing = 1;
        }else{
            this.player.flipX = true;
            this.facing = -1;
        }
        
        let deltaX = mousePos.x - this.player.x ;
        let deltaY = (this.player.y - 45) - mousePos.y;
        let radians = Math.atan2(deltaY, deltaX);
        let degrees = (radians * 180 / Math.PI);
        let gunAngle = this.facing < 0 ? -(degrees) + 180 : degrees;

        let gunPos = {
            x: Math.cos(degrees * Math.PI / 180) * 15,
            y: Math.sin(degrees * Math.PI / 180) * 15 + 45,
        }
        let leftHandPos = {
            x: Math.cos((degrees + (this.facing < 0 ? 25 : -25)) * Math.PI / 180) * 15,
            y: Math.sin((degrees + (this.facing < 0 ? 25 : -25)) * Math.PI / 180) * 15 + 45,
        }
        let rightHandPos = {
            x: Math.cos((degrees + (this.facing < 0 ? 3 : -3)) * Math.PI / 180) * 25,
            y: Math.sin((degrees + (this.facing < 0 ? 3 : -3)) * Math.PI / 180) * 25 + 45,
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