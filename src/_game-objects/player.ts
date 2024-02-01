import { Scene } from "phaser";
import { Entity } from "./entity";
import { Inputs } from "src/_types/common";
import { TestScene } from "./scenes/test-scene";
import { CircularProgress } from "phaser3-rex-plugins/templates/ui/ui-components";
import { Projectile } from "./projectile";

export class Player implements Entity {

    // private graphics: Phaser.
    private group: Phaser.Physics.Arcade.Group; 
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    private debug?: {graphics: Phaser.GameObjects.Graphics};
    private dustParticles: Phaser.GameObjects.Particles.ParticleEmitter;

    dodging = false;
    canDodge = true;
    dodgeVelocity = { x: 0, y: 0 };

    rampUpSpeed = 0.5;
    rampDownSpeed = 1;
    velocity = { x: 0, y: 0 };
    dodgeSpeedMultiplier = 10;

    playerSpeed = 150;

    staminaPercent = .5;
    private _stamina = 50;
    get stamina() {return this._stamina}
    set stamina(val: number) {
        this._stamina = val;
        this.staminaPercent = val / this.maxStamina;
        let color = (this._stamina > 50) ? 0x00ff00 : ((this._stamina > 20) ? 0xffff00 : 0xff0000);
        this.staminaUi.setValue(this.staminaPercent);
        this.staminaUi.setBarColor(color);
    }
    maxStamina = 100;

    staminaUi: CircularProgress;

    lastRegenTime = this.scene.time.now;
    regenerationSpeed = 1;

    facingDirection?: string;

    constructor(private scene: TestScene, private inputs: Inputs) {
        let config = this.scene.physics.getConfig();
        // To see the debug graphics for cursor.
        if(config.debug) {
            this.debug = {
                graphics: this.scene.add.graphics({lineStyle: {color: 0xff0000}})
            }
        }
        
        let createAnim = (name: string) => {
            this.scene.anims.create({
                key: `walk_${name}`,
                frames: this.scene.anims.generateFrameNames('guy', {
                    prefix: `walk_${name}_`,
                    suffix: '.png',
                    start: 1,
                    end: 3
                }),
                repeat: -1,
                frameRate: 4,
                yoyo: true
            })
        }
        for(let dir of ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest']) createAnim(dir);
        
        
        this.staminaUi = this.scene.rexUI.add.circularProgress(100, 100, 10, 0xffffff, this.staminaPercent)
        this.staminaUi.depth = 10
        
        let init = this.scene.map.dungeon.initial_room;
        let pos = init ? init.parent_pos(init.get_center_pos()) : [0,0]
        let ts = this.scene.map.tilesize;
        
        this.player = this.scene.physics.add.sprite(pos[0] * ts, pos[1] * ts, 'guy');
        // this.player.scale = 4;
        // Dust particles, when the player moves or dashes.
        this.dustParticles = this.scene.add.particles(200, 200, 'flares',
        {
            frame: 'white',
            color: [ 0x96e0da, 0x937ef3 ],
            colorEase: 'quart.out',
            lifespan: 1000,
            angle: { min: 0, max: 360 },
            scale: { start: .25, end: 0, ease: 'Expo.easeIn' },
            speed: { min: 5, max: 25 },
            blendMode: Phaser.BlendModes.NORMAL,
            frequency: 10,
            emitting: false,
            stopAfter: 20,
            follow: this.player,
            followOffset: {x: -200, y: -190}
        });
        this.group = this.scene.physics.add.group([
            this.player,
        ]);
        
        // Special Inputs
        this.inputs['space']?.on('down', () => {
            if ((Math.abs(this.velocity.x) > 0.4 || Math.abs(this.velocity.y) > 0.4) && !this.dodging && this.canDodge && this.stamina >= 40) {
                // console.log("dodging");
                this.dodging = true;
                this.stamina -= 20;
                let velocity = this.dodgeVelocity = this.velocity;

                var speed = Math.sqrt(velocity.x*velocity.x + velocity.y*velocity.y);
                if (speed > 0) {
                    // Normalize the velocity
                    velocity.x /= speed;
                    velocity.y /= speed;
                }

                this.velocity = {
                    x: velocity.x * this.dodgeSpeedMultiplier,
                    y: velocity.y * this.dodgeSpeedMultiplier
                }
                
                this.canDodge = false;
                this.removeStamina(20);
                this.emitDust();
                this.scene.time.delayedCall(500, () => {
                    this.canDodge = true;
                })
            }
        })
    }

    // 
    update() {
        this.updateMove();

        if (this.stamina < this.maxStamina) {
            if(this.staminaUi.alpha < 1) this.staminaUi.alpha = this.lerp(this.staminaUi.alpha, 1, .2);

            if(this.scene.time.now - this.lastRegenTime >= 100) {
                this.stamina += this.regenerationSpeed;
                if (this.stamina > this.maxStamina) {
                    this.stamina = this.maxStamina;
                }
                this.lastRegenTime = this.scene.time.now;
            }
        } else {
            if(this.staminaUi.alpha > 0) this.staminaUi.alpha = this.lerp(this.staminaUi.alpha, 0, .2);
        }

        if(this.scene.input.activePointer.isDown) {
            // Get the angle in radians between the mouse pointer and the player
            let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y + 35,
                this.scene.input.mousePointer.x, this.scene.input.mousePointer.y);

            // Convert that angle into degrees
            let angleDeg = Phaser.Math.RadToDeg(angle);
            
            // let velocity = {x: Math.cos(angle) * 1000, y: Math.sin(angle) * 1000};
            // let offset = {x: Math.cos(angle - .5) * 100 + this.player.x, y: Math.sin(angle - .5) * 100 + this.player.y + 35}
            // let offset2 = {x: Math.cos(angle + .5) * 100 + this.player.x, y: Math.sin(angle + .5) * 100 + this.player.y + 35}

            // new Projectile(this.scene, {
            //     position: offset,
            //     velocity: velocity,
            //     lifespan: 2000,
            //     sprite: 'flares',
            //     // angle,
            //     // multiShot: 3
            // });
            // new Projectile(this.scene, {
            //     position: offset2,
            //     velocity: velocity,
            //     lifespan: 2000,
            //     sprite: 'flares',
            //     // angle,
            //     // multiShot: 3
            // });

            
            
            // Adjust angle degrees to start from North (-90 deg) and wrap at positive degree values
            angleDeg = (angleDeg + 90 + 360) % 360;
            
            let spread = 48;
            let spreadDeg = 360 / spread;
            for(let i = -spread/2; i < spread/2; i++) {
                // console.log(i);
                
                let angle = Phaser.Math.DegToRad((angleDeg - 90) + (spreadDeg * i));
                let velocity = {x: Math.cos(angle) * 1000, y: Math.sin(angle) * 1000};
                let offset = {x: Math.cos(angle) * 100 + this.player.x, y: Math.sin(angle) * 100 + this.player.y + 35}
                new Projectile(this.scene, {
                    position: offset,
                    velocity: velocity,
                    lifespan: 2000,
                    sprite: 'flares',
                    // angle,
                    // multiShot: 3
                }); 
            }


            let direction = '';

            if (angleDeg >= 22.5 && angleDeg < 67.5) {
                direction = 'northeast';
            } else if (angleDeg >= 67.5 && angleDeg < 112.5) {
                direction = 'east';
            } else if (angleDeg >= 112.5 && angleDeg < 157.5) {
                direction = 'southeast';
            } else if (angleDeg >= 157.5 && angleDeg < 202.5) {
                direction = 'south';
            } else if (angleDeg >= 202.5 && angleDeg < 247.5) {
                direction = 'southwest';
            } else if (angleDeg >= 247.5 && angleDeg < 292.5) {
                direction = 'west';
            } else if (angleDeg >= 292.5 && angleDeg < 337.5) {
                direction = 'northwest';
            } else {
                direction = 'north';
            }
            this.facingDirection = direction;
            // console.log(direction);
        } else this.facingDirection = undefined;

        if(this.debug) {
            this.debug.graphics.clear();
            this.debug.graphics.lineBetween(this.player.x, this.player.y + 35, this.scene.input.mousePointer.x, this.scene.input.mousePointer.y)
            this.debug.graphics.strokePath()
        }
    }

    private updateMove() {
        let targetVelocity = { x: 0, y: 0 };
        // set movement direction
        let direction = '';

        if (this.inputs['up']?.isDown) {
            targetVelocity.y = -1;
            direction += 'north';
        } else if (this.inputs['down']?.isDown) {
            targetVelocity.y = 1;
            direction += 'south';
        }

        if (this.inputs['left']?.isDown) {
            targetVelocity.x = -1;
            direction += 'west';
            // if(this.velocity.x > 0) this.emitDust();
        } else if (this.inputs['right']?.isDown) {
            targetVelocity.x = 1;
            direction += 'east';
            // if(this.velocity.x < 0) this.emitDust();
        }

        if(direction) {
            this.player.anims.play(`walk_${this.facingDirection ? this.facingDirection : direction}`, true);
        } else {
            // if(this.facingDirection) this.player.anims.setCurrentFrame(this.player.anims.get(`walk_${this.facingDirection}`).getFrameByProgress(.5));
            this.player.anims.stop();
            if(this.facingDirection) {
                let frame = this.scene.anims.get(`walk_${this.facingDirection}`).frames[1];
                this.player.anims.setCurrentFrame(frame);
            }
        }

        var speed = Math.sqrt(targetVelocity.x*targetVelocity.x + targetVelocity.y*targetVelocity.y);
        if (speed > 0) {
            // Normalize the targetVelocity
            targetVelocity.x /= speed; 
            targetVelocity.y /= speed;
        }
        
        if(this.dodging) {
            this.velocity.x = this.lerp(this.velocity.x, this.dodgeVelocity.x, 0.15);
            this.velocity.y = this.lerp(this.velocity.y, this.dodgeVelocity.y, 0.15);
            if(Math.abs(this.velocity.x) <= 1.1 && Math.abs(this.velocity.y) <= 1.1) {
                this.dodging = false;
                this.dodgeVelocity = {x: 0, y: 0};
            }

        } else {

            let rampSpeed = (targetVelocity.x === 0 && targetVelocity.y === 0) ? this.rampDownSpeed : this.rampUpSpeed;
            this.velocity.x = this.lerp(this.velocity.x, targetVelocity.x, rampSpeed);
            this.velocity.y = this.lerp(this.velocity.y, targetVelocity.y, rampSpeed);
        }

        this.group.setVelocity(
            this.velocity.x * this.playerSpeed,
            this.velocity.y * this.playerSpeed
        );

        this.staminaUi.setPosition(this.player.x, this.player.y - 50);
    }
    
    removeStamina (amount: number) {
        this.stamina = Math.max(this.stamina - amount, 0);
    }

    emitDust() {
        this.dustParticles.start();
    }

    lerp(start: number, end: number, speed: number) {
        return start + (end - start) * speed;
    }
}