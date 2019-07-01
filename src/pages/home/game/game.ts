import { Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
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
  constructor() {
    
  }
  
  ngAfterViewInit() {
    console.log(this.gameContainer);
    this.game = new Phaser.Game(this.gameContainer.nativeElement.clientWidth, this.gameContainer.nativeElement.clientHight, Phaser.CANVAS, 'gameContainer');
  }
}


