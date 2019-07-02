import { Component, AfterViewInit, ViewChild, Input } from "@angular/core";
import { Inventories } from "../../providers/Inventories";
import { Item } from './item';

@Component({
    selector: 'inventory',
    templateUrl: 'inventory.html'
})
export class Inventory implements AfterViewInit{
    @ViewChild('invContainer') invContainer: any;
    @Input() columns: number = 0;
    @Input() rows: number = 0;
    @Input() id: string = undefined;
    
    public size = {
        r: 9,
        c: 6
    }
    label = "";
    cells = [];
    items = {};
    

    constructor(private inventories: Inventories) { }

    ngAfterViewInit() {
        this.size.r = this.rows;
        this.size.c = this.columns;
        if(!this.id) this.id = this.inventories.getId();

        // load inventory
        this.inventories.loadInventory(this.id).then((inventory:any)=>{
            new Promise((res)=>{
                if(inventory){
                    console.log(inventory);
                    this.size = inventory.size;
                    this.label = inventory.label;

                    if(inventory.items.length > 0) {
                        inventory.items.forEach((itemData, key)=>{
                            let item = new Item();
                            item.init(itemData).then((id)=>{
                                item.element.ondragstart = (ev: DragEvent)=>{this.onDrag(ev, this);}
                                item.element.ondrop = (ev: DragEvent)=>{this.onDrop(ev, this);}
                                item.element.ondragend = (ev: DragEvent)=>{this.onDragEnd(ev, this);}
            
                                this.items[id] = item;
                                if(inventory.items.length == key + 1) res();
                            })
                        })
                    }else{
                        res();
                    }
                }else{
                    res();
                }
            }).then(()=>{
                let inv = <HTMLElement>this.invContainer.nativeElement.children[0];
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
                this.inventories.submitInventory(this);
                this.placeItems();
            })
        })
    }

    onDrag(ev: DragEvent, parent){
        let target = <HTMLElement>ev.toElement;
        let item = this.items[target.id];
        parent.inventories.pickedSize = item.size;
        parent.inventories.pickedUp = {
            x: Math.floor(ev.layerX / (parent.getSize(item.size.x) / item.size.x)),
            y: Math.floor(ev.layerY / (parent.getSize(item.size.y) / item.size.y))
        }
        parent.inventories.dragging = target;
    }

    onDragOver(ev: DragEvent, parent) {
        let target = <HTMLElement>ev.toElement;
        parent.inventories.targetIventory = parent.id;
        let cellPos = {
            x: parseInt(target.getAttribute('data-cell-x')),
            y: parseInt(target.getAttribute('data-cell-y'))
        }
        let minMax = {
            x: {
                min: cellPos.x - parent.inventories.pickedUp.x,
                max: cellPos.x + ((parent.inventories.pickedSize.x - 1) - parent.inventories.pickedUp.x)
            },
            y: {
                min: cellPos.y - parent.inventories.pickedUp.y,
                max: cellPos.y + ((parent.inventories.pickedSize.y - 1) - parent.inventories.pickedUp.y)
            }
        }

        let place = true;
        for(let x = 0; x < parent.inventories.pickedSize.x; x ++){
            for(let y = 0; y < parent.inventories.pickedSize.y; y ++){
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
            parent.inventories.targetCell = parent.cells[parent.getIndex({x: minMax.x.min, y: minMax.y.min}, parent.size.c)];
        }else{
            parent.inventories.targetCell = undefined;
        }

        if(parent.inventories.dragging){
            parent.inventories.dragging.style.display = "none";
            let item = parent.items[parent.inventories.dragging.id];
            if(item && !item.picked){
                item.picked = true;
                parent.recalc();
            }
        }
    }

    onDrop(ev: DragEvent, parent){
        ev.preventDefault();
        let event = new Event('dragend');
        parent.inventories.dragging.dispatchEvent(event);
    }

    onDragEnd(ev, parent){
        if(parent.inventories.targetCell){
            let item = parent.items[parent.inventories.dragging.id];
            item.picked = false;
            item.invPos = {
                x: parseInt(parent.inventories.targetCell.getAttribute('data-cell-x')),
                y: parseInt(parent.inventories.targetCell.getAttribute('data-cell-y'))
            }
            parent.recalc();
            parent.inventories.targetCell.appendChild(parent.inventories.dragging);
            if(parent.id != parent.inventories.targetIventory){
                parent.sendItem(parent.items[parent.inventories.dragging.id]);
                delete parent.items[parent.inventories.dragging.id];
            }
        }
        parent.inventories.dragging.style.display = "unset";
        parent.inventories.dragging = undefined;
    }

    placeItems() {
        console.log(this.items);
        Object.keys(this.items).forEach((key)=>{
            let item = this.items[key];
            this.cells[this.getIndex(item.invPos, this.size.c)].appendChild(item.element);
        });
        this.recalc();
    }

    sendItem(item) {
        this.inventories.getInventory(this.inventories.targetIventory).then((inventory:any)=>{
            inventory.items[item.id] = item;
            console.log(this.items, inventory.items);
            inventory.recalc(true);
            this.recalc();
        })
    }

    recalc(events = false){
        console.log('recalc', this.id, this.items);
        this.cells.forEach((cell: HTMLElement)=>{ cell.removeAttribute('filled'); });
        Object.keys(this.items).forEach((key)=>{
            let item = this.items[key];
            if(events){
                item.element.ondragstart = (ev: DragEvent)=>{this.onDrag(ev, this);}
                item.element.ondrop = (ev: DragEvent)=>{this.onDrop(ev, this);}
                item.element.ondragend = (ev: DragEvent)=>{this.onDragEnd(ev, this);}
            }
            
            if(!item.picked){
                for(let x = 0; x < item.size.x; x++){
                    for(let y = 0; y < item.size.y; y++){
                        let cellPos = {
                            x: x + item.invPos.x, 
                            y: y + item.invPos.y
                        };
                        let cell = this.cells[this.getIndex(cellPos, this.size.c)];
                        console.log(cellPos, cell);
                        if(cell) cell.setAttribute('filled', 'true');
                    }
                }
            }

        })
    }

    getSize(num){
        return (30 * num) + (2 * (num - 1)) 
    }

    getIndex(pos = {x: 0, y: 0}, width){
        return pos.x + width * pos.y;
    }
}