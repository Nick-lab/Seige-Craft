import Phaser from 'phaser';
import { Guns } from './Guns';
export class Player{
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
    follow = {
        x: 0,
        y: 0,
        zoom: 2
    };
    container;
    // parent object / scene class
    parent: any
    // graphics for drawing debug shapes
    graphics: Phaser.GameObjects.Graphics;

    constructor(private guns: Guns) {

    }

    init(options){
        // initialize player model and starting variables
        Object.keys(options).forEach((key)=>{this[key]=options[key]});

        this.spine = this.parent.physics.add.spine(200, 200, 'player', 'Idle', true);
        // this.spine.drawDebug = true;
        // this.spine.setSize(100,200);
        //this.parent.physics.world.enable(this.spine);

        console.log(this.spine, this.parent);
        this.hands = this.spine.findBone('Hands');
        this.handBones.push(this.spine.findBone('Left Arm'))
        this.handBones.push(this.spine.findBone('Right Arm'))
        this.arms.push(this.spine.skeleton.findIkConstraint('Left Arm'))
        this.arms.push(this.spine.skeleton.findIkConstraint('Right Arm'))
        
        this.gun = this.guns.getGun('m4a1', true)
        if(this.gun){
            console.log('got', this.gun);
            this.spine.skeleton.setAttachment('Gun', this.gun.name);
        }
        
        
        // set spine mixes for animation mixing
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
        // calculate delta time for shooting delays
        let deltaTime = delta / 100;
        // default animation to idle
        let animation = 'Idle';
        // start final speed defaults
        let finalSpeed = {
            x: 0,
            y: 0
        };
        // figure out which animation to play and set variables for shooting buff / debuff
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

        // move character with final speed based on delta time
        this.spine.x += (finalSpeed.x * deltaTime);
        this.spine.y += (finalSpeed.y * deltaTime);
        // play final animation
        this.play(animation, true);
        // shoot gun
        if(this.gun) this.shoot(delta);
        // for later 
        if(!this.animating) this.updateHands(mousePos);
    }

    shoot(delta){
        if (this.gun) {
            let shot = false;
            // check if gun in semi or auto need burst mode
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
                // subtract bullet after function
                this.gun.magazine --;
                // pass bullet up to scene
                this.parent.addShot(this.drawTrajectory(this.gun.muzzle));
                // play shot sound
                this.parent.sound.play(this.gun.sound);

                // set max racoil angle
                let angle = this.gun.maxRecoil;
                // include movement state buff
                if(this.running) angle *= 1.5;
                // half recoil max for crouching
                else if(this.crouching) angle /= 2;
                // set recoil with random 0.0-1.0 
                this.recoilAngle = (angle - this.recoilAngle) * Math.random();
            }
            // lerp recoiled aim back to zero
            if(this.recoilAngle > 0){
                this.recoilAngle = this.lerp(this.recoilAngle, 0, .1)
            }

            //if(this.shots.length > 15) this.shots.pop();
            // calculate next available follow up shot based on delta time lag independant
            if(this.gun.shootDelay > 0){
                this.gun.shootDelay -= delta
            }
        }
    }

    drawTrajectory(muzzle = {x: 0, y: 0}) {
        var correctionFactor = 0.99;
        // gun rotation in radians
        var theta = this.gun.rotation;
        // calculate starting trajectory angle including aiming rotation and current recoil value 0 - maxRecoil
        theta += this.facing > 0 ? this.recoilAngle * Math.PI / 180 : -(this.recoilAngle * Math.PI / 180);
        var x = 0, y = 0;
        let points = [];
        // calculate four point curve based on bullet speed
        for(var t = 0; t < 10; t += 2.5) {
            // calculate next position of point in the loop
            x = this.gun.bullet_speed * t * Math.cos(theta) * correctionFactor;
            y = this.gun.bullet_speed * t * Math.sin(theta) * correctionFactor - 0.5 * this.parent.GRAVITY * t * t;
            // covert point to muzzle location
            let point = {
                x: x + muzzle.x, 
                y: muzzle.y - y
            }
            // push point to array of point to be converted into bezier curve
            points.push(point);
        }
        // start path with starting point / muzzle location
        let path = new Phaser.Curves.Path(points[0].x, points[0].y);
        // add last three points to convert line to bezier
        path.cubicBezierTo(points[3].x, points[3].y, points[1].x, points[1].y, points[2].x, points[2].y);
        // console.log(points);
        // return cubic beziar path might update to array of coordinates eg [1x, 1y, 2x, 2y, 3x, 3y]
        return path;
    }

    switchGun(){
        // switch gun this is placeholder
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
        // play spine animation
        if(this.phase != animation){
            this.spine.play(animation, loop);
            this.phase = animation;
        }
    }

    updateHands(mousePos){
        // set shoulder target position for lerping shoulder position used for calculating aiming angle
        let target_pos = this.crouching ? this.shoulder_crouch : this.shoulder_offset;
        // lerp shoulder pos
        this.shoulder_pos = this.shoulder_pos + (target_pos - this.shoulder_pos) * 0.1;

        // check direction aiming for calculating bullet drop and flipping character bone rig
        if(mousePos.x > this.spine.x){
            // facing right
            this.spine.flipX = false;
            this.facing = 1;
        }else{
            // facing left
            this.spine.flipX = true;
            this.facing = -1;
        }
        
        // deltas for calculating angle
        let deltaX = mousePos.x - this.spine.x ;
        let deltaY = (this.spine.y - this.shoulder_pos) - mousePos.y;

        // set follow variables for camera to follow 1/2 x position and 1/4 y
        this.follow.x = (deltaX / 2) + this.spine.x;
        this.follow.y = ((mousePos.y - (this.spine.y - this.shoulder_pos)) / 4) + (this.spine.y - this.shoulder_pos);
        // calculate zoom from mouse distance to left and right side of screen
        this.follow.zoom = 2 - ( (this.gun ? this.gun.zoom : .2)* Math.abs(((this.parent.input.activePointer.x / this.parent.game.renderer.width)-.5) * 2));
        
        // calculate radians from deltas and set gun sprite rotation
        // gun rotation used in shooting math to calculate trajectory
        let radians = this.gun.rotation = Math.atan2(deltaY, deltaX);
        // convert radians to degrees
        let degrees = (radians * 180 / Math.PI);
        degrees += this.facing > 0 ? this.recoilAngle : -this.recoilAngle;
        let gunAngle = this.facing < 0 ? -(degrees) + 180 : degrees;
        let armDistance = 10;

        // set hand positions stored in gun object and muzzle position for accurate shooting
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
        
        // update all positions for character rig
        this.handBones[0].worldX = leftHandPos.x;
        this.handBones[0].worldY = leftHandPos.y;
        this.handBones[1].worldX = rightHandPos.x;
        this.handBones[1].worldY = rightHandPos.y;
        // call update function on bone to force inverse kinematics to update
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