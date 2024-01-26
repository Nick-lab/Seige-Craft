import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as Phaser from 'phaser';
import { TestScene } from 'src/_game-objects/scenes/test-scene';

import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
// import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js';
// import { PhaserNavMeshPlugin } from "phaser-navmesh";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
  @ViewChild('gameContainer') container?: ElementRef<HTMLElement>;
  game?: Phaser.Game;

  constructor() {}

  ngAfterViewInit(): void {
    
    let container = this.container?.nativeElement;
    if (!container) throw new Error('Container not found');

    const Config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      backgroundColor: '#000',
      parent: container,
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: "100%",
        height: "100%"
      },
      scene: [TestScene],
      plugins: {
        scene: [
          {
            key: 'rexUI',
            plugin: RexUIPlugin,
            mapping: 'rexUI'
          }
        ],
      },
      render: {
        pixelArt: true,
        roundPixels: false,
        antialias: false,
        powerPreference: 'high-performance',
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
    };

    this.game = new Phaser.Game(Config);
  }
}
