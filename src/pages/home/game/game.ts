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
 
  inventory = false;
  game;
  menuOpen = false;
  view = this;
  
  constructor(private inventories: Inventories) {
    
  }
  
  ionViewWillLeave(){
    console.log('leaving');
  }

  ngAfterViewInit() {
    console.log(this.gameContainer);
    let config = {
      width: '100%',
      height: '100%',
      renderer: Phaser.CANVAS,
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
    this.game.load.image('player', 'assets/game_assets/characters/character.png', 100,100);
    
  }
  this.create = function () {
    this.graphics = this.game.add.graphics(0,0);

    this.game.world.setBounds(0,0,1920,1920);
    this.physics.startSystem(Phaser.Physics.P2JS);
    this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.stage.backgroundColor = '#0072bc';

    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)  

    this.line = new Phaser.Line();

    this.player = this.game.add.sprite(200,200, 'player');
    this.player.width = 32;
    this.player.height = 64;
    
    this.game.physics.p2.enable(this.player);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.camera.follow(this.player);
    this.player.body.fixedRotation = true;
    
    // game vars
    this.entities = [];
    this.fired = false;
    this.deltaTime = 0;
  }
  this.update = function () {
    this.deltaTime = this.game.time.elapsed/1000;
    this.graphics.clear();
    this.player.body.setZeroVelocity();

    if(this.entities.length > 0){
      for(let e = 0; e < this.entities.length; e++){
        let entity = this.entities[e];
        if(entity.update) entity.update();
      }
    }

    if (this.cursors.up.isDown)
    {
      this.player.body.moveUp(300)
    }
    else if (this.cursors.down.isDown)
    {
      this.player.body.moveDown(300);
    }

    if (this.cursors.left.isDown)
    {
      this.player.body.velocity.x = -300;
    }
    else if (this.cursors.right.isDown)
    {
      this.player.body.moveRight(300);
    }

    let mousePos = {
      x: this.game.input.mousePointer.x + (-this.game.world.position.x), 
      y: this.game.input.mousePointer.y + (-this.game.world.position.y)
    }
    this.line.start.set(this.player.x, this.player.y);
    this.line.end.set(mousePos.x, mousePos.y);
    this.mouseAngle = this.getAngle({x:this.player.x, y: this.player.y}, mousePos);

    if(this.game.input.activePointer.leftButton.isDown && !this.fired){
      this.fired = true;
      let bullet = new this.Bullet();
      bullet.init({
        parent: this,
        angle: this.mouseAngle,
        s: 3000,
        g: .2,
        pos: {x: this.player.x, y: this.player.y}
      });
      console.log('fired');
      this.entities.push(bullet);
    }else if(!this.game.input.activePointer.leftButton.isDown){
      this.fired = false;
    }

    this.render();
  }

  this.render = function () {
    if(this.entities.length > 0){
      for(let e = 0; e < this.entities.length; e++){
        let entity = this.entities[e];
        if(entity.render) entity.render();
      }
    }
  }

  this.getAngle = function (p1 = {x: 0, y: 0},p2 = {x: 0, y: 0}, degree = false) {  
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    let theta = Math.atan2(-dy,-dx);
    if(degree){
      theta *= 180 / Math.PI
      if(theta < 0) theta += 360;
      return theta;
    }else{
      return theta;
    }
  }

  this.Bullet = function() {
    this.posList = [];

    this.init = (options) => {
      Object.keys(options).forEach((key)=>{
        this[key] = options[key];
      });

    }

    this.update = () => {
      let theta = (this.angle * 180 / Math.PI) - 90
      if(theta < 0) theta += 360;

      if(theta > 0 && theta < 180){
        this.angle -= this.g * this.parent.deltaTime;
      }else if(theta > 180 && theta < 360){
        this.angle += this.g * this.parent.deltaTime;
      }

      let velocity = {
        x: this.s * Math.cos(this.angle),
        y: this.s * Math.sin(this.angle)
      }

      this.pos = {
        x: this.pos.x += velocity.x * this.parent.deltaTime,
        y: this.pos.y += velocity.y * this.parent.deltaTime
      }
      this.posList.unshift(this.pos);
      if(this.posList.length > 5){
        this.posList.pop();
      }
    }

    this.render = () => {
      if(this.posList.length > 0){
        for(let i = 0; i < this.posList.length; i ++){
          let pos = this.posList[i];
          if(i == 0){
            this.parent.graphics.lineStyle(2, "0xFFFFFF", 10);
            this.parent.graphics.moveTo(pos.x,pos.y);
          }else{
            this.parent.graphics.lineTo(pos.x, pos.y);
          }
        }
      }
    }
  }
}
