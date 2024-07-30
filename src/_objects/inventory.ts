
import * as EventEmitter from "events";
import { Item, ItemType } from "src/_game-objects/items";
import { Inventories } from "src/_services/Inventories";


export class Inventory extends EventEmitter {
    id: string;
    label: string = '';
    rows: number = 0;
    columns: number = 0;
    filters: ItemType[] = [];
    items: Item[] = [];
    cells: any[][] = [];
    noDrop: boolean = false;

    constructor(options: InventoryOptions, private inventories: Inventories) {
        super();
        this.id = options.id ? options.id : this.inventories.getId();
        this.rows = options.rows;
        this.columns = options.columns;
        this.items = options.items;
        if(options.label) this.label = options.label;
        if(options.filters) this.filters = options.filters;
        if(options.noDrop) this.noDrop = true;

        this.setCells()

        for(let i = 0; i < this.items.length; i++) {
            let item: Item = this.items[i];
            if(!item.id) item.id = this.inventories.getId();
        }
    }

    pushItem(item: Item, amount?: number) {
        console.log('ID', item.id);
        
        if(!item.id) item.id = this.inventories.getId();
        if(amount) {
            item = Object.assign({}, item);
            if(item.stackable) {
                // for(let i = 0; i < amount / item.stackable; i++) {
                // push multiple stacks ??
                // }

                item.amount = Math.min(amount, item.stackable);
            }
        }
        this.items.push(item);
        this.reCalc();
        this.emit('update-items');
    }

    addItem(item: Item) {
        if(item.stackable && item.amount) {
            this.stackItem(item);
        } else {
            console.log('NO STACK', item);
            
            this.items.push(item);
        }
        this.reCalc();
    }
    
    removeItem(id: string) {
        for(let i = 0; i < this.items.length; i++){
            let item = this.items[i];
            if (item.id === id) {
                this.items.splice(i, 1);
                this.reCalc();
                
                this.emit('removed-item', item);
                return;
            }
        }
        console.log('ITEM NOT FOUND', this.id, this.items, id);
        
    }

    empty() {
        this.items = [];
        this.reCalc();
    }

    private stackItem(item: Item) {
        console.log('STACK ITEM', item);
        if(item.amount && item.stackable) {
            let foundStackable: Item | undefined = undefined;
            
            for(let iitem of this.items) {
                if(item.name == iitem.name && iitem.amount && iitem.stackable && iitem.amount < iitem.stackable) {
                    foundStackable = iitem;
                    break;
                }
            }
            if(foundStackable && foundStackable.amount && foundStackable.stackable) {
                if(foundStackable.amount + item.amount > foundStackable.stackable) {
                    let overflow = foundStackable.amount + item.amount - foundStackable.stackable;
                    item.amount = overflow;
                    foundStackable.amount = foundStackable.stackable;
                    this.stackItem(item);
                    
                } else {
                    foundStackable.amount = foundStackable.amount + item.amount;
                }
                
                
            } else {
                if(item.amount < item.stackable) {
                    this.items.push(Object.assign({}, item));
                    this.reCalc();
                } else {
                    let newItem = Object.assign({}, item);
                    newItem.amount = item.stackable;
                    let passItem = Object.assign({}, item);
                    passItem.amount = item.amount - item.stackable;

                    this.items.push(newItem);
                    this.stackItem(passItem);
                }
            }
        }
    }

    private setCells() {
        this.cells = Array(this.rows).fill(0).map(x => Array(this.columns).fill(0));
    }

    private reCalc() {
        // recalculate the cells of an inventory replace place items and empty cells
        this.setCells();
        for(let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            if(!item.id) item.id = this.inventories.getId();
            if(item.pos) {
                for(let x = 0; x < item.size.x; x ++) {
                    for(let y = 0; y < item.size.y; y ++){
                        if(x > 0 || y > 0){
                            let cellPos = {
                                x: x + item.pos.x,
                                y: y + item.pos.y
                            }
                            this.cells[cellPos.y][cellPos.x] = 'filled';
                        }
                    }
                }
                this.cells[item.pos.y][item.pos.x] = item;
                
            } else {
                let space: any = this.findSPace(item);
                if(space) {
                    let [c,r] = this.getXY(space.targetCell);
                    console.log('XY', c,r);
                    
                    item.pos = {x: c, y: r};
                    this.cells[r][c] = item;
                    for(let c = 1; c < space.fillCells.length; c ++){
                        let [x, y] = this.getXY(space.fillCells[c]);
                        this.cells[y][x] = 'filled';
                    }
                }
            }
        }
    }

    findSPace(item: Item) {
        for(let i = 0; i < this.rows * this.columns; i ++){
            let cell = i;
            let placeCells = [];
            let canPlace = true;
            
            let invPos = {
                x: i % this.columns,
                y: Math.floor(i / this.columns)
            }
            
            for(let x = 0; x < item.size.x; x++){

                for(let y = 0; y < item.size.y; y++){
                    let cellPos = {
                        x: x + invPos.x, 
                        y: y + invPos.y
                    };
                    if(this.cells[cellPos.y][cellPos.x]) {
                        canPlace = false;
                        break;
                    }
                    if(canPlace && (cellPos.x > this.columns - 1 || cellPos.y > this.rows - 1)){
                        canPlace = false;
                        break;
                    }
                    // push index of cell
                    placeCells.push(this.getIndex(cellPos.x, cellPos.y));
                    
                }
                // move on to next cell
                if(!canPlace) break;
            }

            if(canPlace){
                return {targetCell: cell, fillCells: placeCells};
            }else if(i == (this.rows * this.columns) - 1){
                return false;
            }
        }
        return false;
    }

    getIndex(x: number, y: number) {
        return x + this.columns * y;
    }

    getXY(index: number) {
        return [index % this.columns, Math.floor(index / this.columns)];
    }
}

export interface InventoryOptions {
    id?: string;
    label?: string;
    rows: number;
    columns: number;
    filters?: ItemType[];
    items: Item[];
    noDrop?: boolean;
}