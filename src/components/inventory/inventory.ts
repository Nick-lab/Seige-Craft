import { Component, AfterViewInit, ViewChild, Input } from "@angular/core";
import { Item } from './item';

@Component({
    selector: 'inventory',
    templateUrl: 'inventory.html'
})
export class Inventory implements AfterViewInit{
    @ViewChild('inventory') inventory: any;
    @Input() columns: number = 0;
    @Input() rows: number = 0;
    @Input() id: String = "";
    
    private dragging: HTMLElement = undefined;
    private targetCell: HTMLElement = undefined;
    public size = {
        r: 9,
        c: 6
    }
    cells = [];
    items = [];
    pickedUp = {x: 0,y: 0};
    pickedSize = {x: 0,y: 0};

    constructor() { }

    ngAfterViewInit() {
        this.size.r = this.rows;
        this.size.c = this.columns;

        let inv = <HTMLElement>this.inventory.nativeElement.children[0];
        inv.setAttribute('data-size-y', this.size.r.toString())
        inv.setAttribute('data-size-x', this.size.c.toString())
        inv.innerHTML = "";
        for(let row = 0; row < this.size.r; row ++){
          // create row
          let rowEl = document.createElement('div');
          rowEl.classList.add('row');
          rowEl.classList.add(row == 0 ? 'first' : row == this.size.r - 1 ? 'last' : 'middle')
          for(let col = 0; col < this.size.c; col ++){
            // create column
            let colEl = document.createElement('div');
            colEl.setAttribute('data-cell-x', col.toString())
            colEl.setAttribute('data-cell-y', row.toString())
            colEl.classList.add('cell');
            //if(col == 4 && row == 2) colEl.setAttribute('filled', "true")
            colEl.ondragover = (ev: DragEvent)=>{this.onDragOver(ev, this)}
    
            this.cells.push(colEl);
            rowEl.appendChild(colEl);
          }
          // place row
          inv.appendChild(rowEl);
        }

        if(this.id){
            // load inventory from storage
            let itemSize = { x: 1, y: 1 }
            let pos = {x: 2, y: 0};
            let index = this.getIndex(pos, this.size.c)
            let item = document.createElement('div');
            item.setAttribute('draggable', 'true');
            item.setAttribute('data-size-x', itemSize.x.toString());
            item.setAttribute('data-size-y', itemSize.y.toString());
            item.style.width = this.getSize(itemSize.x) + 'px';
            item.style.height = this.getSize(itemSize.y) + 'px';
            item.classList.add('item');
            item.setAttribute('data-index', index.toString());
        
            item.ondragstart = (ev: DragEvent)=>{this.onDrag(ev, this);}
            item.ondrop = (ev: DragEvent)=>{this.onDrop(ev, this);}
            item.ondragend = (ev: DragEvent)=>{this.onDragEnd(ev, this);}
        
            this.items.push(item);
            this.cells[index].appendChild(item);
        }else{
            let itemSize = { x: 3, y: 2 }
            let pos = {x: 0, y: 1};
            let index = this.getIndex(pos, this.size.c)
            let item = document.createElement('div');
            item.setAttribute('draggable', 'true');
            item.setAttribute('data-size-x', itemSize.x.toString());
            item.setAttribute('data-size-y', itemSize.y.toString());
            item.style.width = this.getSize(itemSize.x) + 'px';
            item.style.height = this.getSize(itemSize.y) + 'px';
            item.classList.add('item');
            item.setAttribute('data-index', index.toString());
        
            item.ondragstart = (ev: DragEvent)=>{this.onDrag(ev, this);}
            item.ondrop = (ev: DragEvent)=>{this.onDrop(ev, this);}
            item.ondragend = (ev: DragEvent)=>{this.onDragEnd(ev, this);}
        
            this.items.push(item);
            this.cells[index].appendChild(item);
        }
    }

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
        ev.dataTransfer.setData("item-size-x", parent.pickedSize.x);
        ev.dataTransfer.setData("item-size-y", parent.pickedSize.y);
        ev.dataTransfer.setData("item-picked-x", parent.pickedUp.x);
        ev.dataTransfer.setData("item-picked-y", parent.pickedUp.y);
        ev.dataTransfer.setData("request-inventory", parent.id);
        console.log(ev, parent.pickedUp);
    }

    onDragOver(ev: DragEvent, parent) {
        let target = <HTMLElement>ev.toElement;
        let requestInv = ev.dataTransfer.getData('request-inventory');
        console.log(requestInv, parent.id);
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
                let cell = parent.cells[parent.getIndex(checkPos, parent.size.c)];
                if(cell && cell.getAttribute('filled')){
                    place = false
                }
            }
        }

        if(minMax.x.min >= 0 && minMax.y.min >= 0 && minMax.x.max <= parent.size.c - 1 && minMax.y.max <= parent.size.r - 1 && place){
            ev.preventDefault();
            parent.targetCell = parent.cells[parent.getIndex({x: minMax.x.min, y: minMax.y.min}, parent.size.c)];
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
        parent.dragging = undefined;
    }

    getSize(num){
        return (30 * num) + (2 * (num - 1)) 
    }

    getIndex(pos = {x: 0, y: 0}, width){
        return pos.x + width * pos.y;
    }
}