export class Projectile {
    sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(scene: Phaser.Scene, config: any) {
        this.sprite = scene.physics.add.sprite(config.position.x, config.position.y, config.sprite || '');
        // this.sprite = scene.physics.add.sprite(config.position.x + (i * config.angle ? Math.cos(config.angle) * 100 : 1), config.position.y + (i * config.angle ? Math.sin(config.angle) * 100 : 1), config.sprite || '');
        this.sprite.setVelocity(config.velocity.x, config.velocity.y);
        this.sprite.setBodySize(50, 50);
        this.sprite.setScale(0.5, 0.5);
        
        scene.time.delayedCall(config.lifespan || 1000, this.destroy.bind(this));

        // scene.time.delayedCall(500, () => {this.sprite?.setScale(3, 3)});
    }

    destroy() {
        // After x amount of time / off screen / hit something
        this.sprite?.destroy();
        delete this.sprite;
    }
}

interface ProjectileConfig {
    position: {x: number, y: number};
    velocity: {x: number, y: number};
    sprite?: string;
    spriteFrame?: string;
    lifespan?: number;
    angel?: number;
    multiShot?: number;
}