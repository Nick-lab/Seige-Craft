import * as Phaser from 'phaser';
export class Test extends Phaser.Scene{
    graphics: Phaser.GameObjects.Graphics;
    player: any;
    hands: any;
    handBones: any = [];
    arms: any = [];
    facing: any = 1;
    crouching: boolean = false;
    running: boolean = false;
    cursors: any ;
    backSpeed = 3;
    speed = 5;
    phase = '';
    shoulder_offset = 45;
    shoulder_crouch = 35;
    shoulder_pos = 45;
    GRAVITY = 6;

    gun: any = {
        bullet_speed: 300,
        rpm: 300,
        mode: 'semi',
        select: ['semi','auto'],
        rotation: 0,
        muzzle: {
            x: 0,
            y: 0
        }
    }

    preload() {
        this.load.image('player', 'assets/game_assets/characters/skeleton.png');
        this.load.image('grid', 'assets/game_assets/debug-grid-1920x1920.png');
        this.load.setPath('assets/game_assets/characters');
        (<any>this.load).spine('player', 'skeleton.json', 'skeleton.atlas');
    }

    create() {
        this.graphics = this.add.graphics();
        this.add.image(0, 0, 'grid').setOrigin(0).setAlpha(0.5);

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
            right:Phaser.Input.Keyboard.KeyCodes.D,
            crouch:Phaser.Input.Keyboard.KeyCodes.CTRL,
            running:Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

        this.player.setMix('Walk', 'Idle', 0.4)
        this.player.setMix('Idle', 'Walk', 0.3)

        this.player.setMix('Walk', 'Run', 0.3)
        this.player.setMix('Run', 'Walk', 0.5)

        this.player.setMix('Crouch', 'Idle', 0.5)
        this.player.setMix('Idle', 'Crouch', 0.3)

        this.player.setMix('Walk Back', 'Idle', 0.3)
        this.player.setMix('Idle', 'Walk Back', 0.3)

        this.player.setMix('Walk', 'Walk Back', 0.3)
        this.player.setMix('Walk Back', 'Walk', 0.3)

        this.player.setMix('Walk', 'Crouch Walk', 0.3)
        this.player.setMix('Crouch Walk', 'Walk', 0.4)

        this.player.setMix('Run', 'Crouch Walk', 0.3)
        this.player.setMix('Crouch Walk', 'Run', 0.4)

        this.player.setMix('Walk Back', 'Crouch Walk Back', 0.3)
        this.player.setMix('Crouch Walk Back', 'Walk Back', 0.4)

        this.player.setMix('Crouch', 'Crouch Walk', 0.3)
        this.player.setMix('Crouch Walk', 'Crouch', 0.3)

        this.player.setMix('Crouch', 'Crouch Walk Back', 0.3)
        this.player.setMix('Crouch Walk Back', 'Crouch', 0.3)

        console.log(this.cursors, this.player);

        this.cameras.main.setBounds(0, 0, 1920, 1920);

        this.cameras.main.startFollow(this.player, true, 0.09, 0.09, 0 , 60);
        // this.cameras.main.roundPixels = true;

        this.cameras.main.setZoom(1);
        console.log(this.input.activePointer);
    }

    update(time, delta) {
        this.graphics.clear()
        let deltaTime = delta / 100;
        let animation = 'Idle'
        let finalSpeed = 0;

        if(this.cursors.running.isDown){
            this.running = true;
            this.crouching = false;
        }else if(this.cursors.crouch.isDown){
            this.crouching = true;
            this.running = false;
        }else{
            this.crouching = false;
            this.running = false;
        }

        if(this.cursors.right.isDown){
            if(this.facing > 0){
                // facing and moving right
                if(this.running){
                    finalSpeed = this.speed * 1.5;
                    animation = 'Run';
                }else if(this.crouching){
                    finalSpeed = this.speed * .75;
                    animation = 'Crouch Walk';
                }else{
                    finalSpeed = this.speed;
                    animation = 'Walk';
                }
            }else{
                // moving right facing left
                if(this.crouching){
                    finalSpeed = this.backSpeed * .75;
                    animation = 'Crouch Walk Back';
                }else{
                    finalSpeed = this.backSpeed;
                    animation = 'Walk Back';
                }
            }
        }

        if(this.cursors.left.isDown){
            if(this.facing < 0){
                // facing and moving right
                if(this.running){
                    finalSpeed = this.speed * 1.5;
                    animation = 'Run';
                }else if(this.crouching){
                    finalSpeed = this.speed * .75;
                    animation = 'Crouch Walk';
                }else{
                    finalSpeed = this.speed;
                    animation = 'Walk';
                }
            }else{
                // moving right facing left
                if(this.crouching){
                    finalSpeed = this.backSpeed * .75;
                    animation = 'Crouch Walk Back';
                }else{
                    finalSpeed = this.backSpeed;
                    animation = 'Walk Back';
                }
            }
            finalSpeed = -finalSpeed;
        }

        if(this.crouching && !this.cursors.left.isDown && !this.cursors.right.isDown){
            animation = 'Crouch';
        }

        if(this.cursors.right.isDown && this.cursors.left.isDown){
            finalSpeed = 0;
            animation = 'Idle';
        }
        this.player.x += (finalSpeed * deltaTime);
        this.play(animation, true);
        this.updateHands();
        this.drawTrajectory(this.gun.muzzle);
    }
    
    resize() {

    }

    updateHands() {
        let mousePos = {
            x: this.input.activePointer.x + this.cameras.main.scrollX,
            y: this.input.activePointer.y + this.cameras.main.scrollY
        }
        let target_pos = this.crouching ? this.shoulder_crouch : this.shoulder_offset;
        this.shoulder_pos = this.shoulder_pos + (target_pos - this.shoulder_pos) * 0.1;

        if(mousePos.x > this.player.x){
            this.player.flipX = false;
            this.facing = 1;
        }else{
            this.player.flipX = true;
            this.facing = -1;
        }
        
        let deltaX = mousePos.x - this.player.x ;
        let deltaY = (this.player.y - this.shoulder_pos) - mousePos.y;
        let radians= this.gun.rotation = Math.atan2(deltaY, deltaX);
        let degrees = (radians * 180 / Math.PI);
        let gunAngle = this.facing < 0 ? -(degrees) + 180 : degrees;
        let armDistance = 10;
        let gunPos = {
            x: Math.cos(degrees * Math.PI / 180) * armDistance,
            y: Math.sin(degrees * Math.PI / 180) * armDistance + this.shoulder_pos,
        }
        let leftHandPos = {
            x: Math.cos((degrees + (this.facing < 0 ? 25 : -25)) * Math.PI / 180) * armDistance,
            y: Math.sin((degrees + (this.facing < 0 ? 25 : -25)) * Math.PI / 180) * armDistance + this.shoulder_pos,
        }
        let rightHandPos = {
            x: Math.cos((degrees + (this.facing < 0 ? 3 : -3)) * Math.PI / 180) * (armDistance + 10),
            y: Math.sin((degrees + (this.facing < 0 ? 3 : -3)) * Math.PI / 180) * (armDistance + 10) + this.shoulder_pos,
        }
        this.gun.muzzle = {
            x: (Math.cos(degrees * Math.PI / 180) * (armDistance + 30)) + this.player.x,
            y: -(Math.sin(degrees * Math.PI / 180) * (armDistance + 30) + this.shoulder_pos) + this.player.y,
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

    play(animation, loop = false){
        if(this.phase != animation){
            this.player.play(animation, loop);
            this.phase = animation;
        }
    }

    lerp(start, target, amount){
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return start + (target - start) * amount;
    }

    drawTrajectory(muzzle = {x: 0, y: 0}) {
        var correctionFactor = 0.99;
        var theta = this.gun.rotation;
        var x = 0, y = 0;
        let points = [];

        this.graphics.lineStyle(.5, 0xFF0000);
        this.graphics.moveTo(muzzle.x, muzzle.y);

        for(var t = 0; t < 10; t += 0.1) {
            x = this.gun.bullet_speed * t * Math.cos(theta) * correctionFactor;
            y = this.gun.bullet_speed * t * Math.sin(theta) * correctionFactor - 0.5 * this.GRAVITY * t * t;
            let point = {
                x: x + muzzle.x, 
                y: muzzle.y - y
            }
            points.push(point);
            this.graphics.lineTo(point.x, point.y);
            if (y > 300) break;
        }
        this.graphics.strokePath();
    }
    
}