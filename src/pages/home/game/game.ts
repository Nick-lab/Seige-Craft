import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Inventories } from '../../../providers/Inventories';
import * as Phaser from 'phaser';
import SpineWebGLPlugin from '../../../assets/spine/SpineWebGLPlugin';

import { Test } from './Scene';

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
    this.game.destroy(true);
  }

  ngAfterViewInit() {

    var config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      backgroundColor: '#ffffff',
      parent: this.container.nativeElement,
      scale: {
        // The game will be scaled manually in the resize()
        mode: Phaser.Scale.RESIZE,
        width: "100%",
        height: "100%"
      },
      plugins: {
        scene: [{ key: 'SpineWebGLPlugin', plugin: SpineWebGLPlugin, start: true, sceneKey: 'spine' }]
      },
      scene: [Test],
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      }
    };

    this.game = new Phaser.Game(config);
  }

}
