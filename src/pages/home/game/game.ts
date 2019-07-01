import { Component, ViewChild, AfterViewInit } from '@angular/core';
import "pixi";
import "p2";
import * as Phaser from "phaser-ce";

@Component({
  selector: 'game-page',
  templateUrl: 'game.html'
})
export class GamePage implements AfterViewInit{
  @ViewChild('gameContainer') gameContainer: any;
  @ViewChild('inventory') inventory: any;
  game;
  menuOpen = false;
  view = this;

  inventories = {
    inv: {
      size: {
        r: 9,
        c: 6
      },
      cells: [],
      items: []
    }
  }


  constructor() {
    
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
    this.setupInv();

  }

  setupInv() {
    let inv = <HTMLElement>this.inventory.nativeElement.children[0];
    inv.setAttribute('data-size-y', this.inventories.inv.size.r.toString())
    inv.setAttribute('data-size-x', this.inventories.inv.size.c.toString())
    inv.innerHTML = "";
    for(let row = 0; row < this.inventories.inv.size.r; row ++){
      // create row
      let rowEl = document.createElement('div');
      rowEl.classList.add('row');
      rowEl.classList.add(row == 0 ? 'first' : row == this.inventories.inv.size.r - 1 ? 'last' : 'middle')
      for(let col = 0; col < this.inventories.inv.size.c; col ++){
        // create column
        let colEl = document.createElement('div');
        colEl.setAttribute('data-cell-x', col.toString())
        colEl.setAttribute('data-cell-y', row.toString())
        colEl.classList.add('cell');
        if(col == 4 && row == 2) colEl.setAttribute('filled', "true")
        colEl.ondragover = (ev: DragEvent)=>{this.onDragOver(ev, this)}

        this.inventories.inv.cells.push(colEl);
        rowEl.appendChild(colEl);
      }
      // place row
      inv.appendChild(rowEl);
    }

    let pos = {x: 0, y: 1};
    let index = this.getIndex(pos, this.inventories.inv.size.c)
    let item = document.createElement('div');
    item.setAttribute('draggable', 'true');
    item.setAttribute('data-size-x', '2');
    item.setAttribute('data-size-y', '4');
    item.style.width = this.getSize(2) + 'px';
    item.style.height = this.getSize(4) + 'px';
    item.classList.add('item');
    item.setAttribute('data-index', index.toString());

    item.ondragstart = (ev: DragEvent)=>{this.onDrag(ev, this);}
    item.ondrop = (ev: DragEvent)=>{this.onDrop(ev, this);}
    item.ondragend = (ev: DragEvent)=>{this.onDragEnd(ev, this);}

    this.inventories.inv.items.push(item);
    this.inventories.inv.cells[index].appendChild(item);
    console.log(this.inventories);
  }

  dragging: HTMLElement = undefined;
  targetCell: HTMLElement = undefined;
  pickedUp = {x: 0,y: 0};
  pickedSize = {x: 0,y: 0};

  onDrag(ev: DragEvent, parent){
    let target = <HTMLElement>ev.toElement;

    parent.pickedSize = {
      x: parseInt(target.getAttribute('data-size-x')),
      y: parseInt(target.getAttribute('data-size-y'))
    }
    parent.pickedUp = {
      x: Math.floor(ev.layerX / (parent.getSize(parent.pickedSize.x) / parent.pickedSize.x)),
      y: Math.floor(ev.layerY / (parent.getSize(parent.pickedSize.y) / parent.pickedSize.y))
    }
    parent.dragging = target;
    ev.dataTransfer.setData("target", target.getAttribute('data-index'));
    console.log(ev, parent.pickedUp);
  }

  onDragOver(ev: DragEvent, parent) {
    //ev.stopPropagation();
    let target = <HTMLElement>ev.toElement;
    let cellPos = {
      x: parseInt(target.getAttribute('data-cell-x')),
      y: parseInt(target.getAttribute('data-cell-y'))
    }
    let minMax = {
      x: {
        min: cellPos.x - parent.pickedUp.x,
        max: cellPos.x + ((parent.pickedSize.x - 1) - parent.pickedUp.x)
      },
      y: {
        min: cellPos.y - parent.pickedUp.y,
        max: cellPos.y + ((parent.pickedSize.y - 1) - parent.pickedUp.y)
      }
    }

    let place = true;
    for(let x = 0; x < parent.pickedSize.x; x ++){
      for(let y = 0; y < parent.pickedSize.y; y ++){
        let checkPos = {
          x: minMax.x.min + x,
          y: minMax.y.min + y
        }
        if(parent.inventories.inv.cells[parent.getIndex(checkPos, this.inventories.inv.size.c)].getAttribute('filled')){
          place = false
        }
      }
    }
    if(minMax.x.min >= 0 && minMax.y.min >= 0 && minMax.x.max <= parent.inventories.inv.size.c - 1 && minMax.y.max <= parent.inventories.inv.size.r - 1 && place){
      ev.preventDefault();
      parent.targetCell = parent.inventories.inv.cells[parent.getIndex({x: minMax.x.min, y: minMax.y.min}, this.inventories.inv.size.c)];
    }else{
      console.log('no fit')
      parent.targetCell = undefined;
    }

    if(parent.dragging){
      parent.dragging.style.display = "none";
    }
  }

  onDrop(ev: DragEvent, parent){
    ev.preventDefault();
    let event = new Event('dragend');
    parent.dragging.dispatchEvent(event);
  }

  onDragEnd(ev, parent){
    
    if(parent.targetCell){
      parent.targetCell.appendChild(parent.dragging);
    }
    parent.dragging.style.display = "unset";


  }

  getSize(num){
    return (30 * num) + (2 * (num - 1)) 
  }

  getIndex(pos = {x: 0, y: 0}, width){
    return pos.x + width * pos.y;
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
