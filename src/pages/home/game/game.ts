import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Inventories } from '../../../providers/Inventories';

import "pixi";
import "p2";
import * as Phaser from "phaser-ce";

@Component({
  selector: 'game-page',
  templateUrl: 'game.html'
})
export class GamePage implements AfterViewInit{
  @ViewChild('gameContainer') gameContainer: any;
 
  game;
  menuOpen = false;
  view = this;
  
  constructor(private inventories: Inventories) {
    
  }
  
  ngAfterViewInit() {
    console.log(this.gameContainer);
    let config = {
      width: '100%',
      height: '100%',
      renderer: Phaser.CANVAS,
      antialias: true,
      parent: 'gameContainer'
    };
    this.game = new Phaser.Game(config);
    this.game.super = this;
    this.game.state.add("scene", Scene, true);
    
  }

}

function Scene() {
  this.preload = function () {
    // load game assets
  }
  this.create = function () {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.stage.backgroundColor = '#0072bc';
  }
  this.update = function () {

  }
}
