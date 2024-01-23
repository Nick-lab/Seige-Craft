import { Scene } from "phaser";
import { Entity } from "./entity";
import { Inputs } from "src/_types/common";

export class Player implements Entity {

    // private graphics: Phaser.
    private group!: Phaser.Physics.Arcade.Group; 
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    private debug?: {graphics: Phaser.GameObjects.Graphics};
    private dustParticles!: Phaser.GameObjects.Particles.ParticleEmitter;

    dodging = false;
    rampUpSpeed = 0.3;
    rampDownSpeed = 0.1;
    velocity = { x: 0, y: 0 };

    constructor(private scene: Scene, private inputs: Inputs) {

    }
    // create player group, sprite and weapons
    create() {
        let config = this.scene.physics.getConfig();
        if(config.debug) {
            this.debug = {
                graphics: this.scene.add.graphics({lineStyle: {color: 0xff0000}})
            }
        }

        

        this.dustParticles = this.scene.add.particles(200, 200, 'flares',
        {
            frame: 'white',
            color: [ 0x96e0da, 0x937ef3 ],
            colorEase: 'quart.out',
            lifespan: 1500,
            angle: { min: -100, max: -80 },
            scale: { start: 1, end: 0, ease: 'Expo.easeIn' },
            speed: { min: 50, max: 100 },
            blendMode: 'ADD',
            // quantity: 5
        });

        this.player = this.scene.physics.add.sprite(0, 0, '')
        this.group = this.scene.physics.add.group([
            this.player,
            // this.dustParticles
        ]);
        
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
        } else if (this.inputs['right']?.isDown) {
            targetVelocity.x = 1;
        }

        var speed = Math.sqrt(targetVelocity.x*targetVelocity.x + targetVelocity.y*targetVelocity.y);
        if (speed > 0) {
            // Normalize the targetVelocity
            targetVelocity.x /= speed; 
            targetVelocity.y /= speed;
        }

        // calculate ramping speed
        let rampSpeed = (targetVelocity.x === 0 && targetVelocity.y === 0) ? this.rampDownSpeed : this.rampUpSpeed;

        // this.dustParticles.emitting = (Math.abs(this.velocity.x) > .5 || Math.abs(this.velocity.y) > .5)

        // applies the ramping
        
        this.velocity.x = this.lerp(this.velocity.x, targetVelocity.x, rampSpeed);
        this.velocity.y = this.lerp(this.velocity.y, targetVelocity.y, rampSpeed);
        this.group.setVelocity(this.velocity.x * 150, this.velocity.y * 150);
    }

    lerp(start: number, end: number, speed: number) {
        return start + (end - start) * speed;
    }
}