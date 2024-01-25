import { Scene } from "phaser";
import { Entity } from "./entity";
import { Inputs } from "src/_types/common";
import { TestScene } from "./scenes/test-scene";

export class Player implements Entity {

    // private graphics: Phaser.
    private group!: Phaser.Physics.Arcade.Group; 
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    private debug?: {graphics: Phaser.GameObjects.Graphics};
    private dustParticles!: Phaser.GameObjects.Particles.ParticleEmitter;

    dodging = false;
    dodgeVelocity = { x: 0, y: 0 };

    rampUpSpeed = 0.5;
    rampDownSpeed = 1;
    velocity = { x: 0, y: 0 };

    staminaPercent = 1;
    stamina = 50;
    maxStamina = 100;

    graphics!: Phaser.GameObjects.Graphics;

    constructor(private scene: TestScene, private inputs: Inputs) { }

    // create player group, sprite and weapons
    create() {
        let config = this.scene.physics.getConfig();
        // if(config.debug) {
        //     this.debug = {
        //         graphics: this.scene.add.graphics({lineStyle: {color: 0xff0000}})
        //     }
        // }

        console.log(this.scene.rexUI);
        
        let stamina = this.scene.rexUI.add.circularProgress(100, 100, 10, 0xffffff, this.staminaPercent)

        // create the tween
        this.scene.tweens.add({
            targets: stamina,
            value: 1,
            duration: 2000, // Duration in ms
            ease: 'Sine.easeInOut',  // This is cubic easing function
            yoyo: true, // If true, the animation will go back to its start value when completed
            repeat: -1, // -1 means it will repeat forever
        });
        
        this.player = this.scene.physics.add.sprite(0, 0, '')
        // Dust particles, when the player moves or dashes.
        this.dustParticles = this.scene.add.particles(200, 200, 'flares',
        {
            frame: 'white',
            color: [ 0x96e0da, 0x937ef3 ],
            colorEase: 'quart.out',
            lifespan: 250,
            angle: { min: -30, max: 5 },
            scale: { start: .25, end: 0, ease: 'Expo.easeIn' },
            // speed: { min: 25, max: 100 },
            blendMode: Phaser.BlendModes.NORMAL,
            frequency: 10,
            emitting: false,
            stopAfter: 20,
            follow: this.player,
            followOffset: {x: -200, y: -190}
        });
        this.group = this.scene.physics.add.group([
            this.player,
            // this.dustParticles
        ]);
        
        this.scene.time.addEvent({
            delay: 2000, // Every 2 seconds.
            callback: () => {
                // Math.min will set stam to +10 and if it ends up greater than Max, it will set it to Max.
                this.stamina = Math.min(this.stamina + 10, this.maxStamina);
            },
            loop: true
        })

        // Special Inputs
        this.inputs['space']?.on('down', () => {
            if ((Math.abs(this.velocity.x) > 0.4 || Math.abs(this.velocity.y) > 0.4) && !this.dodging && this.stamina >= 20) {
                // console.log("dodging");
                this.dodging = true;
                this.stamina -= 20;
                this.dodgeVelocity.x = this.velocity.x;
                this.dodgeVelocity.y = this.velocity.y;
    
                this.velocity.x = this.velocity.x * 8;
                this.velocity.y = this.velocity.y * 8;

                if(this.velocity.x > 0) this.emitDust('right');
                else if(this.velocity.x < 0) this.emitDust('left');
            } 
        })
    }

    // 
    update() {
        this.updateMove();

        if(this.debug) {
            this.debug.graphics.clear();
            this.debug.graphics.lineBetween(this.player.x, this.player.y, this.scene.input.mousePointer.x, this.scene.input.mousePointer.y)
            this.debug.graphics.strokePath()
        }
    }

    private updateMove() {
        let targetVelocity = { x: 0, y: 0 };

        if (this.inputs['up']?.isDown) {
            targetVelocity.y = -1;
        } else if (this.inputs['down']?.isDown) {
            targetVelocity.y = 1;
        }

        if (this.inputs['left']?.isDown) {
            targetVelocity.x = -1;
            if(this.velocity.x > 0) this.emitDust('left');
        } else if (this.inputs['right']?.isDown) {
            targetVelocity.x = 1;
            if(this.velocity.x < 0) this.emitDust('right');

        }

        var speed = Math.sqrt(targetVelocity.x*targetVelocity.x + targetVelocity.y*targetVelocity.y);
        if (speed > 0) {
            // Normalize the targetVelocity
            targetVelocity.x /= speed; 
            targetVelocity.y /= speed;
        }

        // if (this.inputs['space']?.isDown && (Math.abs(this.velocity.x) > 0.4 || Math.abs(this.velocity.y) > 0.4) && !this.dodging) {
        //     console.log("dodging");
        //     this.dodging = true;
        //     this.dodgeVelocity.x = this.velocity.x;
        //     this.dodgeVelocity.y = this.velocity.y;

        //     this.velocity.x = this.velocity.x * 8;
        //     this.velocity.y = this.velocity.y * 8;
        // } 
        
        
        if(this.dodging) {
            this.velocity.x = this.lerp(this.velocity.x, this.dodgeVelocity.x, 0.15);
            this.velocity.y = this.lerp(this.velocity.y, this.dodgeVelocity.y, 0.15);
            if(Math.abs(this.velocity.x) <= 1.1 && Math.abs(this.velocity.y) <= 1.1) {
                this.dodging = false;
                this.dodgeVelocity = {x: 0, y: 0};
            }

        } else {

    
            // calculate ramping speed
            let rampSpeed = (targetVelocity.x === 0 && targetVelocity.y === 0) ? this.rampDownSpeed : this.rampUpSpeed;
    
            // this.dustParticles.emitting = (Math.abs(this.velocity.x) > .5 || Math.abs(this.velocity.y) > .5)
    
            // applies the ramping
            
            this.velocity.x = this.lerp(this.velocity.x, targetVelocity.x, rampSpeed);
            this.velocity.y = this.lerp(this.velocity.y, targetVelocity.y, rampSpeed);
        }

        this.group.setVelocity(this.velocity.x * 150, this.velocity.y * 150);
    }

    emitDust(dir: 'left' | 'right') {
        switch(dir) {
            case 'left':
                this.dustParticles.setEmitterAngle(0)
                break;
            case 'right':
                this.dustParticles.setEmitterAngle(180)
                break;
        }
        // this.dustParticles.emitParticle()
        // this.dustParticles.setPosition(this.player.x, this.player.y);
        this.dustParticles.start();
        // this.dustParticles.emitParticleAt(this.player.x, this.player.y);
    }

    lerp(start: number, end: number, speed: number) {
        return start + (end - start) * speed;
    }
}