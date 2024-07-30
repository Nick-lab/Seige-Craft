import { Component, AfterViewInit, ViewChild, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Inventory } from "src/_objects/inventory";
import { Inventories } from "src/_services/Inventories";
import { Item } from "src/_game-objects/items";

@Component({
    selector: 'inventory',
    templateUrl: 'inventory.html',
    styleUrls: ['inventory.scss']
})
export class InventoryComponent implements AfterViewInit {
    @Input('inventory') inventory?: Inventory;
    @Input('id') inventoryId?: string;

    constructor(private inventories: Inventories) { }

    get width(): string {
        if(this.inventory) {
            return 100 / this.inventory.columns + '%';
        } else {
            return `${50}px`;
        }
    }

    ngAfterViewInit() {
        // load inventory
        if(!this.inventory && this.inventoryId) {
            setTimeout(() => {

                this.inventory = this.inventories.getInventory(this.inventoryId!);
                console.log(this.inventory);
            }, 5)
        }
    }

    onDragOver(ev: DragEvent, x: number, y: number){
        // console.log('Drag Over Cell');
        
        // dragging over inventory slots
        if(this.inventories && this.inventory && !this.inventory.noDrop && ev.dataTransfer) {
            let targetCell = {
                x: x - this.inventories.pickedUp.x,
                y: y - this.inventories.pickedUp.y
            }
            let max = {
                x: targetCell.x + this.inventories.pickedSize.x,
                y: targetCell.y + this.inventories.pickedSize.y
            }
            let canPlace = true;
            if(this.inventory.filters.length) {
                let item = <Item>JSON.parse(ev.dataTransfer.getData('item'));
                let inFilter = false;
                for(let filter of this.inventory.filters) {
                    // let attrSplit = filter.split(':');
                    // if(attrSplit[0] == 'attr' && attrSplit[1]) {
                    //     // filter by attribute
                    //     let attribute = attrSplit[1];
                    //     if(item.attributes.hasOwnProperty(attribute)) inFilter = true;
                    // } else {
                    //     // filter by type
                    // }
                    if(item.type == filter) inFilter = true;
                }
                if(!inFilter) canPlace = false;
            }
            if(!canPlace) return;
            if (targetCell.x >= 0 && targetCell.y >= 0 && max.x <= this.inventory.columns && max.y <= this.inventory.rows){
                for (let x = 0; x < this.inventories.pickedSize.x; x ++) {
                    for (let y = 0; y < this.inventories.pickedSize.y; y ++) {
                        let cell = this.inventory.cells[y + targetCell.y][x + targetCell.x];
                        if (cell == 'filled' || (cell.id && this.inventories.item && cell.id != this.inventories.item.id)) { 
                            canPlace = false;
                            break;
                        }
                    }
                    if(!canPlace) break;
                }
            } else canPlace = false;
            
    
    
            if (canPlace) ev.preventDefault();
        }
    }

    onDrop(ev: DragEvent, x: number, y: number) {
        // dropping item on inventory slotxs
        ev.preventDefault();
        if(ev.dataTransfer) {
            let item = <Item>JSON.parse(ev.dataTransfer.getData('item'));

            if(!item) return;
            item.pos = {
                x: x - this.inventories.pickedUp.x,
                y: y - this.inventories.pickedUp.y
            };
            let inventory = this.inventories.getInventory(ev.dataTransfer.getData('inventory'))
            // console.log('DRAG DROP', inventory?.items, item);
            
            if(this.inventory && inventory) {
                if(item.id) inventory.removeItem(item.id);
                this.inventory.pushItem(item);
            }
        }
    }

    // onTouchMove(ev: PointerEvent, x: number, y: number) {
    //     console.log('CELL TOUCH MOVE', ev, x, y);
        
    //     // dragging over inventory slots
    //     if(this.inventories && this.inventory && !this.inventory.noDrop && this.inventories.item) {
    //         let targetCell = {
    //             x: x - this.inventories.pickedUp.x,
    //             y: y - this.inventories.pickedUp.y
    //         }
    //         let max = {
    //             x: targetCell.x + this.inventories.pickedSize.x,
    //             y: targetCell.y + this.inventories.pickedSize.y
    //         }
    //         let canPlace = true;
    //         if(this.inventory.filters.length) {
    //             let item = this.inventories.item;
    //             let inFilter = false;
    //             for(let filter of this.inventory.filters) {
    //                 let attrSplit = filter.split(':');
    //                 if(attrSplit[0] == 'attr' && attrSplit[1]) {
    //                     // filter by attribute
    //                     let attribute = attrSplit[1];
    //                     if(item.attributes.hasOwnProperty(attribute)) inFilter = true;
    //                 } else {
    //                     // filter by type
    //                     if(item.type == filter) inFilter = true;
    //                 }
    //             }
    //             if(!inFilter) canPlace = false;
    //         }
    //         if(!canPlace) return;
    //         if (targetCell.x >= 0 && targetCell.y >= 0 && max.x <= this.inventory.columns && max.y <= this.inventory.rows){
    //             for (let x = 0; x < this.inventories.pickedSize.x; x ++) {
    //                 for (let y = 0; y < this.inventories.pickedSize.y; y ++) {
    //                     let cell = this.inventory.cells[y + targetCell.y][x + targetCell.x];
    //                     if (cell == 'filled' || (cell.id && this.inventories.item && cell.id != this.inventories.item.id)) { 
    //                         canPlace = false;
    //                         break;
    //                     }
    //                 }
    //                 if(!canPlace) break;
    //             }
    //         } else canPlace = false;
            
    //         if (canPlace) ev.preventDefault();
    //     }
    // }

    // onTouchEnd(ev: PointerEvent, x: number, y: number) {
    //     console.log('CELL TOUCH END', this.inventories.item, x, y);
    //     if(this.inventories.item && this.inventories.picked_inventory) {
    //         let item = this.inventories.item;

    //         item.pos = {
    //             x: x - this.inventories.pickedUp.x,
    //             y: y - this.inventories.pickedUp.y
    //         };
    //         let inventory = this.inventories.getInventory(this.inventories.picked_inventory)
    //         console.log('TOUCH DROP', inventory?.items, item);
            
    //         if(this.inventory && inventory) {
    //             if(item.id) inventory.removeItem(item.id);
    //             this.inventory.pushItem(item);
    //         }

    //         this.inventories.item = undefined;
    //         this.inventories.picked_inventory = undefined;
    //     }
    // }
}
