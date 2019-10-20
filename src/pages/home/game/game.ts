import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Inventories } from '../../../providers/Inventories';
import Phaser from 'phaser';
import SpineWebGLPlugin from '../../../assets/spine/SpineWebGLPlugin';

import { Scene } from './Scene';

@Component({
  selector: 'game-page',
  templateUrl: 'game.html'
})
export class GamePage implements AfterViewInit{
  @ViewChild('gameContainer') container: any;
  inventory = false;
  game: Phaser.Game;
  menuOpen = false;
  view = this;
  
  constructor(private inventories: Inventories) {}
  
  ionViewWillLeave(){
    // destroy phaser instance when leaving
    this.game.destroy(true);
  }

  ngAfterViewInit() {
    // setup phaser config
    var config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      backgroundColor: '#ffffff',
      parent: this.container.nativeElement,
      scale: {
        // The game will be scaled to fill screen
        mode: Phaser.Scale.ZOOM_4X,
        width: "100%",
        height: "100%"
      },
      plugins: {
        scene: [{ key: 'SpineWebGLPlugin', plugin: SpineWebGLPlugin, start: true, sceneKey: 'spine' }]
      },
      scene: [Scene],
      render: {
        pixelArt: true,
        roundPixels: true,
        antialias: false
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      }
    };
    // initialize phaser
    this.game = new Phaser.Game(config);
  }

}
