import * as Phaser from 'phaser';
export class Test extends Phaser.Scene{
    player: any;
    hands: any;
    handBones: any = [];
    arms: any = [];
    preload() {
        this.load.image('player', 'assets/game_assets/characters/skeleton.png');
        this.load.setPath('assets/game_assets/characters');
        (<any>this.load).spine('player', 'skeleton.json', 'skeleton.atlas');
    }

    create() {
        this.player = (<any>this.add).spine(200, 200, 'player', 'Walk', true);
        this.hands = this.player.findBone('Hands');
        this.handBones.push(this.player.findBone('Left Arm'))
        this.handBones.push(this.player.findBone('Right Arm'))
        this.arms.push(this.player.skeleton.findIkConstraint('Left Arm'))
        this.arms.push(this.player.skeleton.findIkConstraint('Right Arm'))
        console.log(this.player, this.arms, this.hands);
        
    }

    update() {
        let mousePos = {
            x: this.input.activePointer.worldX,
            y: this.input.activePointer.worldY
        }
        this.hands.worldX = mousePos.x;
        this.hands.worldY = mousePos.y;
        this.handBones[0].worldX = mousePos.x;
        this.handBones[1].worldY = mousePos.y;
        this.handBones[0].worldX = mousePos.x;
        this.handBones[1].worldY = mousePos.y;
        // this.hands.appliedValid = true;
        this.arms[0].update();
        this.arms[1].update();
    }

    resize() {

    }
    
}