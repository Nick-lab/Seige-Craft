
export class TestScene extends Phaser.Scene {
    constructor() {
        super({});
    }

    preload() {
        let camera = this.cameras.main
        this.add.text(camera.width / 2, camera.height / 2, "Game", {
            fontSize: 20,
            align: 'center',
            
        });
    }

    create() {
        
    }

    override update() {
        
    }
}