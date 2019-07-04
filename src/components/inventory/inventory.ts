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
    filters = [];

    constructor(private inventories: Inventories) { }

    ngAfterViewInit() {
        // load passed attributes
        this.size.r = this.rows;
        this.size.c = this.columns;
        if(!this.id) this.id = this.inventories.getId();
        
        // load inventory
        this.inventories.loadInventory(this.id).then((inventory:any)=>{
            new Promise((res)=>{
                // if inventory load items
                if(inventory){
                    this.size = inventory.size;
                    this.label = inventory.label;
                    if(inventory.filters) this.filters = inventory.filters;

                    if(inventory.items.length > 0) {
                        inventory.items.forEach((itemData, key)=>{
                            itemData.inventories = this.inventories;
                            let item = new Item();
                            item.init(itemData).then((id)=>{

                                // attach event listeners
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
                // set minimum width for div overflow
                this.invContainer.nativeElement.style.minWidth = (this.getSize(this.size.c) + 19)+ "px";

                let inv = <HTMLElement>this.invContainer.nativeElement.children[0];
                inv.setAttribute('data-size-y', this.size.r.toString())
                inv.setAttribute('data-size-x', this.size.c.toString())
                inv.innerHTML = "";
                // create row / col elements
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
                        
                        colEl.ondragover = (ev: DragEvent)=>{this.onDragOver(ev, this)}
                        
                        // add cell to tracking array
                        this.cells.push(colEl);
                        rowEl.appendChild(colEl);
                    }
                    // place row
                    inv.appendChild(rowEl);
                }
                // submit inventory to inventories provider
                this.inventories.submitInventory(this);
                this.placeItems();
            })
        })
    }

    onDrag(ev: DragEvent, parent){
        // starting event listener defines starting info
        let target = <HTMLElement>ev.toElement;
        let item = this.items[target.id];
        parent.inventories.pickedSize = item.size;
        parent.inventories.item = item;

        // calculate what cell an item was picked up on
        parent.inventories.pickedUp = {
            x: Math.floor(ev.layerX / (parent.getSize(item.size.x) / item.size.x)),
            y: Math.floor(ev.layerY / (parent.getSize(item.size.y) / item.size.y))
        }
        parent.inventories.dragging = target;
    }

    onDragOver(ev: DragEvent, parent) {
        /*
            this event is important it is repetedly fired and defines the target cell to drop item along with target inventory
        */
        let target = <HTMLElement>ev.toElement;
        parent.inventories.targetIventory = parent.id;

        // setup check variables
        let cellPos = {
            x: parseInt(target.getAttribute('data-cell-x')),
            y: parseInt(target.getAttribute('data-cell-y'))
        }
        // minimum and maximum x and y cells an item will be placed on
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

        // check all the cells an item can be placed on for other items
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

        // final check will be replaced with a function for item type filtering
        if(minMax.x.min >= 0 && minMax.y.min >= 0 && minMax.x.max <= parent.size.c - 1 && minMax.y.max <= parent.size.r - 1 && place && parent.canStore() ){
            // prevent default allows onDrop event to be fired
            ev.preventDefault();
            parent.inventories.targetCell = parent.cells[parent.getIndex({x: minMax.x.min, y: minMax.y.min}, parent.size.c)];
        }else{
            parent.inventories.targetCell = undefined;
        }

        // final variable settings
        if(parent.inventories.dragging){
            // hide original element because while dragging the item is still technically where it was untill its droped in a new location
            parent.inventories.dragging.style.display = "none";
            // picked variable for recalc function to ignore that item allowing the item to be placed on the same cells it left
            let item = parent.items[parent.inventories.dragging.id];
            if(item && !item.picked){
                item.picked = true;
                parent.recalc();
            }
        }
    }

    onDrop(ev: DragEvent, parent){
        // for dropping on target cells
        ev.preventDefault();
        let event = new Event('dragend');
        parent.inventories.dragging.dispatchEvent(event);
    }

    onDragEnd(ev, parent){
        // for dropping anywhere other than target cells


        let item = parent.items[parent.inventories.dragging.id];
        item.picked = false;
        if(parent.inventories.targetCell){
            // update items inventory position and place element in target cell
            let item = parent.items[parent.inventories.dragging.id];
            item.picked = false;
            item.invPos = {
                x: parseInt(parent.inventories.targetCell.getAttribute('data-cell-x')),
                y: parseInt(parent.inventories.targetCell.getAttribute('data-cell-y'))
            }
            parent.inventories.targetCell.appendChild(parent.inventories.dragging);
            if(parent.id != parent.inventories.targetIventory){
                // if target inventory in another inventory send that inventoy the item object
                parent.sendItem(parent.items[parent.inventories.dragging.id]);
                delete parent.items[parent.inventories.dragging.id];
            }
        }

        // recalculate the filled cells, save the inventory and show the element
        parent.recalc();
        parent.saveInventory();
        parent.inventories.dragging.style.display = "unset";
        parent.inventories.dragging = undefined;
        
    }

    placeItems() {
        // place loaded items inside inventory
        Object.keys(this.items).forEach((key)=>{
            let item = this.items[key];
            item.parentInventory = this;
            
            if(item.invPos){
                this.cells[this.getIndex(item.invPos, this.size.c)].appendChild(item.element);
            }else{
                let data:any = this.findSPace(item);
                item.invPos = {
                    x: parseInt(data.targetCell.getAttribute('data-cell-x')),
                    y: parseInt(data.targetCell.getAttribute('data-cell-y'))
                }
                data.fillCells.forEach((cell)=>{ cell.setAttribute('filled', 'true'); });
                data.targetCell.appendChild(item.element);
            }
            
            
        });
        this.recalc();
    }

    sendItem(item) {
        // send item to another inventory
        this.inventories.getInventory(this.inventories.targetIventory).then((inventory:any)=>{
            inventory.items[item.id] = item;
            console.log('send item', this, inventory);

            inventory.recalc(true).then(()=>{ inventory.saveInventory(); });
            this.recalc().then(()=>{ this.saveInventory(); });
        });
    }

    recalc(events = false){
        return new Promise((res)=>{
            // clear all inventory cells of filled attribute
            this.cells.forEach((cell: HTMLElement)=>{ cell.removeAttribute('filled'); });
            Object.keys(this.items).forEach((key, index)=>{
                let item = this.items[key];
                if(events){
                    // re assign new event listeners for new inventory
                    item.element.ondragstart = (ev: DragEvent)=>{this.onDrag(ev, this);}
                    item.element.ondrop = (ev: DragEvent)=>{this.onDrop(ev, this);}
                    item.element.ondragend = (ev: DragEvent)=>{this.onDragEnd(ev, this);}
                }
                
                if(!item.picked){
                    // if item is not being ignored loop through cells an item is covering and "fill" them
                    for(let x = 0; x < item.size.x; x++){
                        for(let y = 0; y < item.size.y; y++){
                            let cellPos = {
                                x: x + item.invPos.x, 
                                y: y + item.invPos.y
                            };
                            let cell = this.cells[this.getIndex(cellPos, this.size.c)];
                            if(cell) cell.setAttribute('filled', 'true');
                        }
                    }
                }
                if(Object.keys(this.items).length == index + 1) res();
            });

        });
    }

    canStore() {
        let ret = true;
        let item = this.inventories.item;
        if(item.id == this.id){
            ret = false
        }

        if(this.filters.length > 0 && this.filters.indexOf(item.type) < 0){
            ret = false
        }
        
        return ret;
    }

    saveInventory() {
        new Promise((res)=>{
            // setup temporary object
            let tmp = {
                label: this.label,
                size: this.size,
                items: [],
            }
            // grab saveable item objects
            if(Object.keys(this.items).length > 0){
                Object.keys(this.items).forEach((key, index)=>{
                    tmp.items.push(this.items[key].save());
                    if(Object.keys(this.items).length == index + 1){
                        res(tmp)
                    }
                })
            }else{
                res();
            }

        }).then((inventory)=>{
            // send to inventories provider to handle local or server save
            this.inventories.saveInventory(inventory, this.id);
        })
        
    }

    findSPace(item) {
        if(this.cells.length > 0){
            for(let i = 0; i < this.cells.length; i ++){
                let cell = this.cells[i];
                let canPlace = true;
                let placeCells = [];

                let invPos = {
                    x: parseInt(cell.getAttribute('data-cell-x')),
                    y: parseInt(cell.getAttribute('data-cell-y'))
                }

                for(let x = 0; x < item.size.x; x++){
                    for(let y = 0; y < item.size.y; y++){
                        let cellPos = {
                            x: x + invPos.x, 
                            y: y + invPos.y
                        };
                        let cell = this.cells[this.getIndex(cellPos, this.size.c)];
                        if(cell && cell.getAttribute('filled')) {
                            canPlace = false;
                            break;
                        }
                        if(cellPos.x > this.size.c - 1 || cellPos.y > this.size.r + 1 ){
                            canPlace = false;
                            break;
                        }
                        placeCells.push(cell);
                    }
                    if(!canPlace) break;
                }

                if(canPlace){
                    return {targetCell: cell, fillCells: placeCells};
                }

                if(i == this.cells.length - 1){
                    return false;
                }
            }
        }else{
            return false;
        }
    }

    getSize(num){
        return (30 * num) + (2 * (num - 1)) 
    }

    getIndex(pos = {x: 0, y: 0}, width){
        return pos.x + width * pos.y;
    }
}