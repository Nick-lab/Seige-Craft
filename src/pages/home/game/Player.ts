import * as Phaser from 'phaser';
import { Guns } from './Guns';
export class Player {
    spine: any;
    hands: any;
    handBones: any = [];
    arms: any = [];
    facing: any = 1;
    backSpeed = 3;
    speed = 5;
    phase = '';
    shoulder_offset = 45;
    shoulder_crouch = 35;
    shoulder_pos = 45;
    crouching: boolean = false;
    running: boolean = false;
    recoilAngle: number = 0;
    gun: any;
    animating: boolean = false;
    isPlayer = false;

    parent: any

    constructor(private guns: Guns) {

    }

    init(options){
        Object.keys(options).forEach((key)=>{this[key]=options[key]});

        this.spine = this.parent.add.spine(200, 200, 'player', 'Idle', true);
        this.hands = this.spine.findBone('Hands');
        this.handBones.push(this.spine.findBone('Left Arm'))
        this.handBones.push(this.spine.findBone('Right Arm'))
        this.arms.push(this.spine.skeleton.findIkConstraint('Left Arm'))
        this.arms.push(this.spine.skeleton.findIkConstraint('Right Arm'))
        this.gun = this.guns.getGun('m4a1', true);
        if(this.gun){
            this.spine.skeleton.setAttachment('Gun', this.gun.name);
        }
        

        this.spine.setMix('Walk', 'Idle', 0.4)
        this.spine.setMix('Idle', 'Walk', 0.3)

        this.spine.setMix('Walk', 'Run', 0.3)
        this.spine.setMix('Run', 'Walk', 0.5)

        this.spine.setMix('Crouch', 'Idle', 0.5)
        this.spine.setMix('Idle', 'Crouch', 0.3)

        this.spine.setMix('Walk Back', 'Idle', 0.3)
        this.spine.setMix('Idle', 'Walk Back', 0.3)

        this.spine.setMix('Walk', 'Walk Back', 0.3)
        this.spine.setMix('Walk Back', 'Walk', 0.3)

        this.spine.setMix('Walk', 'Crouch Walk', 0.3)
        this.spine.setMix('Crouch Walk', 'Walk', 0.4)

        this.spine.setMix('Run', 'Crouch Walk', 0.3)
        this.spine.setMix('Crouch Walk', 'Run', 0.4)

        this.spine.setMix('Walk Back', 'Crouch Walk Back', 0.3)
        this.spine.setMix('Crouch Walk Back', 'Walk Back', 0.4)

        this.spine.setMix('Crouch', 'Crouch Walk', 0.3)
        this.spine.setMix('Crouch Walk', 'Crouch', 0.3)

        this.spine.setMix('Crouch', 'Crouch Walk Back', 0.3)
        this.spine.setMix('Crouch Walk Back', 'Crouch', 0.3)
    }



    update(options){
        let delta = 0;
        let cursors;
        let mousePos;
        Object.keys(options).forEach((key)=>{
            if(key == 'delta') delta = options[key];
            else if(key == 'cursors') cursors = options[key];
            else if(key == 'mousePos') mousePos = options[key];
            else{
                this[key] = options[key];
            } 
        });

        let deltaTime = delta / 100;
        let animation = 'Idle'
        let finalSpeed = {
            x: 0,
            y: 0
        };

        if(cursors.running.isDown){
            this.running = true;
            this.crouching = false;
        }else if(cursors.crouch.isDown){
            this.crouching = true;
            this.running = false;
        }else{
            this.crouching = false;
            this.running = false;
        }

        if(cursors.right.isDown){
            if(this.facing > 0){
                // facing and moving right
                if(this.running){
                    finalSpeed.x = this.speed * 1.5;
                    animation = 'Run';
                }else if(this.crouching){
                    finalSpeed.x = this.speed * .75;
                    animation = 'Crouch Walk';
                }else{
                    finalSpeed.x = this.speed;
                    animation = 'Walk';
                }
            }else{
                // moving right facing left
                if(this.crouching){
                    finalSpeed.x = this.backSpeed * .75;
                    animation = 'Crouch Walk Back';
                }else{
                    finalSpeed.x = this.backSpeed;
                    animation = 'Walk Back';
                }
            }
        }

        if(cursors.left.isDown){
            if(this.facing < 0){
                // facing and moving right
                if(this.running){
                    finalSpeed.x = this.speed * 1.5;
                    animation = 'Run';
                }else if(this.crouching){
                    finalSpeed.x = this.speed * .75;
                    animation = 'Crouch Walk';
                }else{
                    finalSpeed.x = this.speed;
                    animation = 'Walk';
                }
            }else{
                // moving right facing left
                if(this.crouching){
                    finalSpeed.x = this.backSpeed * .75;
                    animation = 'Crouch Walk Back';
                }else{
                    finalSpeed.x = this.backSpeed;
                    animation = 'Walk Back';
                }
            }
            finalSpeed.x = -finalSpeed.x;
        }

        if(cursors.up.isDown){
            if(this.running){
                finalSpeed.y = this.backSpeed * 1.5;
                animation = 'Run';
            }else if(this.crouching){
                finalSpeed.y = this.backSpeed * .75;
                animation = 'Crouch Walk';
            }else{
                finalSpeed.y = this.backSpeed;
                animation = 'Walk';
            }
            finalSpeed.y = -finalSpeed.y
        }

        if(cursors.down.isDown){
            if(this.running){
                finalSpeed.y = this.backSpeed * 1.5;
                animation = 'Run';
            }else if(this.crouching){
                finalSpeed.y = this.backSpeed * .75;
                animation = 'Crouch Walk';
            }else{
                finalSpeed.y = this.backSpeed;
                animation = 'Walk';
            }
        }

        if(this.crouching && !cursors.left.isDown && !cursors.right.isDown){
            animation = 'Crouch';
        }

        if(cursors.right.isDown && cursors.left.isDown){
            finalSpeed.x = 0;
            animation = 'Idle';
        }

        
        this.spine.x += (finalSpeed.x * deltaTime);
        this.spine.y += (finalSpeed.y * deltaTime);
        this.play(animation, true);
        if(this.gun) this.shoot(delta);
        if(!this.animating) this.updateHands(mousePos);
    }

    shoot(delta){
        let shot = false;
        if(this.gun.mode == 'auto'){
            if(this.parent.input.activePointer.leftButtonDown() && this.gun.shootDelay <= 0 && this.gun.magazine > 0){
                shot = true;
                this.gun.shootDelay = 1000 / (this.gun.rpm / 60);
            }
        }
        if(this.gun.mode == 'semi'){
            if(this.parent.input.activePointer.leftButtonDown() && this.gun.canShoot){
                shot = true;
                this.gun.canShoot = false;
            }
            if(!this.parent.input.activePointer.leftButtonDown() && !this.gun.canShoot && this.gun.magazine > 0){
                this.gun.canShoot = true;
            }
        }

        if(shot){
            // recoil
            this.gun.magazine --;
            this.parent.addShot(this.drawTrajectory(this.gun.muzzle));
            this.parent.sound.play(this.gun.sound);
            let angle = this.gun.maxRecoil;
            if(this.running) angle *= 1.5;
            else if(this.crouching) angle /= 2;
            
            this.recoilAngle = (angle - this.recoilAngle) * Math.random();
        }
        if(this.recoilAngle > 0){
            this.recoilAngle = this.lerp(this.recoilAngle, 0, .1)
        }

        //if(this.shots.length > 15) this.shots.pop();
        
        if(this.gun.shootDelay > 0){
            this.gun.shootDelay -= delta
        }
    }

    drawTrajectory(muzzle = {x: 0, y: 0}) {
        var correctionFactor = 0.99;
        var theta = this.gun.rotation;
        theta += this.facing > 0 ? this.recoilAngle * Math.PI / 180 : -(this.recoilAngle * Math.PI / 180);
        var x = 0, y = 0;
        let points = [];

        for(var t = 0; t < 10; t += 2.5) {
            x = this.gun.bullet_speed * t * Math.cos(theta) * correctionFactor;
            y = this.gun.bullet_speed * t * Math.sin(theta) * correctionFactor - 0.5 * this.parent.GRAVITY * t * t;
            let point = {
                x: x + muzzle.x, 
                y: muzzle.y - y
            }
            points.push(point);
        }

        let path = new Phaser.Curves.Path(points[0].x, points[0].y);
        path.cubicBezierTo(points[3].x, points[3].y, points[1].x, points[1].y, points[2].x, points[2].y);
        console.log(points);
        return path;
    }

    switchGun(){
        this.gun = this.guns.getGun(this.gun.name, true);
        this.spine.skeleton.setAttachment('Gun', this.gun.name);
    }

    reloadGun(){
        setTimeout(()=>{
            // timeout to sim animation playing
            this.gun.magazine = this.gun.capacity;
        }, 1000)
    }

    play(animation, loop = false){
        if(this.phase != animation){
            this.spine.play(animation, loop);
            this.phase = animation;
        }
    }

    updateHands(mousePos){
        let target_pos = this.crouching ? this.shoulder_crouch : this.shoulder_offset;
        this.shoulder_pos = this.shoulder_pos + (target_pos - this.shoulder_pos) * 0.1;

        if(mousePos.x > this.spine.x){
            this.spine.flipX = false;
            this.facing = 1;
        }else{
            this.spine.flipX = true;
            this.facing = -1;
        }
        
        let deltaX = mousePos.x - this.spine.x ;
        let deltaY = (this.spine.y - this.shoulder_pos) - mousePos.y;
        let radians = this.gun.rotation = Math.atan2(deltaY, deltaX);
        let degrees = (radians * 180 / Math.PI);
        degrees += this.facing > 0 ? this.recoilAngle : -this.recoilAngle;
        let gunAngle = this.facing < 0 ? -(degrees) + 180 : degrees;
        let armDistance = 10;
        let gunPos = {
            x: Math.cos(degrees * Math.PI / 180) * armDistance,
            y: Math.sin(degrees * Math.PI / 180) * armDistance + this.shoulder_pos,
        }
        let leftHandPos = {
            x: Math.cos((degrees + (this.facing < 0 ? this.gun.display.left.deg : -this.gun.display.left.deg)) * Math.PI / 180) * (armDistance + this.gun.display.left.dist),
            y: Math.sin((degrees + (this.facing < 0 ? this.gun.display.left.deg : -this.gun.display.left.deg)) * Math.PI / 180) * (armDistance + this.gun.display.left.dist) + this.shoulder_pos,
        }
        let rightHandPos = {
            x: Math.cos((degrees + (this.facing < 0 ? this.gun.display.right.deg : -this.gun.display.right.deg)) * Math.PI / 180) * (armDistance + this.gun.display.right.dist),
            y: Math.sin((degrees + (this.facing < 0 ? this.gun.display.right.deg : -this.gun.display.right.deg)) * Math.PI / 180) * (armDistance + this.gun.display.right.dist) + this.shoulder_pos,
        }
        this.gun.muzzle = {
            x: (Math.cos((degrees + this.gun.display.muzzle.deg) * Math.PI / 180) * (armDistance + this.gun.display.muzzle.dist)) + this.spine.x,
            y: -(Math.sin((degrees + this.gun.display.muzzle.deg) * Math.PI / 180) * (armDistance + this.gun.display.muzzle.dist) + this.shoulder_pos) + this.spine.y,
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

    lerp(start, target, amount){
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return start + (target - start) * amount;
    }
}