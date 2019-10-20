import { Component, ViewChild } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { DataManager } from '../../providers/DataManager';

import { GamePage } from './game/game';
import { StashPage } from './stash/stash';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{

  @ViewChild('Canvas') canvas: any;
  animation;
  constructor(
    public events: Events,
    public dataMngr: DataManager,
    private nav: NavController
  ){
    
  }

  ionViewDidLoad() {
    this.canvas = <HTMLElement>this.canvas.nativeElement;
    this.animation = new CanvasAnimation().init(this.canvas, Dot);
  }
  
  onPlay() {
    this.nav.push(GamePage);
  }

  onStash() {
    this.nav.push(StashPage);
  }
  
  ionViewDidEnter() {
    //this.socket.connect();
    this.events.publish('window:title', { title: 'Seige Escape' });
  }
}

function CanvasAnimation() {
  this.parent
  this.canvas;
  this.ctx;
  this.dotCount = 20;
  this.dot;
  this.dotColors = [ {r:10,g:15,b:21}, {r:44,g:51,b:63}, {r:102,g:118,b:132},{r:218,g:215,b:205} ]
  this.size = {
    x: 0,
    y: 0
  }
  this.lastMouse = {
    x: 0,
    y: 0
  }
  this.mouseVector = {
    x: 0,
    y: 0
  }
  this.count = Math.PI;
  this.dots = [];

  this.init = (canvas) => {
    this.canvas = <HTMLCanvasElement>canvas;
    this.parent = this.canvas.parentElement
    this.ctx = this.canvas.getContext('2d');
    this.setListeners();
  }

  this.setListeners = () => {
    window.addEventListener('mousemove', (e)=>{
      this.mouseVector = {
        x: this.lastMouse.x - e.x,
        y: this.lastMouse.y - e.y
      }
      this.lastMouse = {
        x: e.x,
        y: e.y
      };
    });
    window.addEventListener('resize', ()=>{
      this.setSize();
    });
    window.addEventListener('mouseleave', () => {
      this.mouseVector = {x:0,y:0};
    });


    this.setSize();
    this.createDots();
    this.update();
  }

  this.setSize = () => {
    this.size = {
      x: this.parent.clientWidth,
      y: this.parent.clientHeight
    }
    this.canvas.width = this.size.x;
    this.canvas.height = this.size.y;
  }

  this.bezierCurcle = (cx,cy,r) => {
    var c;
    var offsetX = 10 * Math.sin(this.count);
    var offsetY = 6 * Math.cos(this.count * 2);
    r = r/2;
  
    this.count += 0.01;
    this.circ = (4*(Math.sqrt(2)-1)/3);

    this.ctx.translate(cx,cy); // translate to centerpoint
  
    this.ctx.beginPath();
  
    // top right
    c = this.circ + ( 0.1 * Math.sin(this.count) );
    this.ctx.moveTo(offsetX + 0, offsetY + -r);
    this.ctx.bezierCurveTo(
      offsetX + c*r, offsetY + -r, 
      offsetX + r, offsetY + -c*r, 
      offsetX + r, offsetY + 0
    );
  
    // bottom right
    c = this.circ + ( 0.1 * Math.cos(this.count) );
    this.ctx.bezierCurveTo(
      offsetX + r, offsetY + c*r, 
      offsetX + c*r, offsetY + r, 
      offsetX + 0, offsetY + r
    );
  
    // bottom left
    c = this.circ + ( 0.1 * Math.sin(this.count * 2) );
    this.ctx.bezierCurveTo(
      offsetX + -c*r, offsetY + r, 
      offsetX + -r, offsetY + c*r, 
      offsetX + -r, offsetY + 0
    );
  
    // top left
    c = this.circ + ( 0.1 * Math.cos(this.count + 1) );
    this.ctx.bezierCurveTo(
      offsetX + -r, offsetY + -c*r, 
      offsetX + -c*r, offsetY + -r, 
      offsetX + 0, offsetY + -r
    );

    this.ctx.closePath();

  }

  this.createDots = () => {
    for(let i = 0; i < this.dotCount; i++){
      let dot = GetDot();
      dot.init(this);
      this.dots.push(dot);
    }
  }

  this.updateDots = () => {
    for(let i = 0; i < this.dots.length; i++){
      let dot = this.dots[i];
      dot.update();
      if(dot.pos.y < -100){
        delete this.dots[i]
        let d = GetDot();
        d.init(this, true);
        this.dots[i] = d;
      }
    }
  }

  this.update = () => {
    if(this.size.x == 0 && this.size.y == 0){
      this.setSize();
    }
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    this.ctx.save();
    
    this.bezierCurcle(10,50,(this.size.y * 2) - (this.size.y / 5));
    this.ctx.clip();

    this.ctx.rect(0,0,this.size.x, this.size.y);
    this.ctx.fillStyle = '#2d343b';
    this.ctx.fill();
    this.updateDots();
    this.ctx.restore();
    window.requestAnimationFrame(this.update);
  }
}

function GetDot() {
  return new Dot();
}

function Dot(){
  this.parent;
  this.pos = {
    x: 0,
    y: 0
  }
  this.color;
  this.r = 5;
  this.speed = .03;
  this.alpha = 0;

  this.init = (parent, bottom = false) => {
    this.parent = parent;
    this.canvasSize = this.parent.size;
    this.color = this.parent.dotColors[Math.round(Math.random() * (this.parent.dotColors.length - 1))];
    this.r = Math.round(((Math.random() * 5) + 2) * 100)  / 100;
    this.speed = 0.05 + Math.random() * 0.2;

    this.pos = {
      x: (this.parent.size.x / 2) * Math.random(),
      y: this.parent.size.y * Math.random()
    }
    
  }

  this.update = () => {
    
    this.pos = {
      x: this.pos.x,
      y: this.pos.y -= this.speed
    }
    if(this.alpha < 1){
      this.alpha += 0.001;
    }
    this.draw();
  }

  this.draw = () => {
    this.parent.ctx.beginPath();
    this.parent.ctx.arc(this.pos.x, this.pos.y,this.r,0,2*Math.PI);
    this.parent.ctx.fillStyle = 'rgba('+this.color.r+','+this.color.g+','+this.color.b+','+this.alpha+')';
    this.parent.ctx.fill();
  }
}
