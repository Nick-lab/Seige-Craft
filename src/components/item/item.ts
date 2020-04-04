import { Component, HostBinding, HostListener, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Inventories } from "../../providers/Inventories";
import { Inventory } from "../inventory/inventory";

@Component({
    selector: 'item',
    templateUrl: 'item.html',
    animations: [
        trigger('context', [
            state('true', style({

            })),
            state('false', style({
                height: '0px'
            })),
            transition('true => false', animate('100ms ease-in')),
            transition('false => true', animate('100ms ease-out'))
        ])
    ]
})
export class Item implements OnInit {
    private inventory: Inventory;
    private contextOpen: boolean = false;
    private contexts = [];
    private contextPos = {
        x: 0,
        y: 0
    }
    @Input() inventoryId: any;
    @Input() item: Item;
    @HostBinding('style.width') width: string;
    @HostBinding('style.height') height: string;
    @HostBinding('style.display') display: string = 'block';
    @ViewChild('Image') image: ElementRef;

    @HostListener('dblclick') onDoubleClick() {
        if((['case', 'bag']).indexOf(this.item.type) > -1) {
            this.onOpen();
        }
    }

    @HostListener('dragstart', ['$event']) onDrag(ev: DragEvent){
        console.log('drag start');
        // starting event listener defines starting info
        let item = this.item;
        this.inventories.pickedSize = item.size;
        // calculate what cell the item was picked up at
        this.inventories.pickedUp = {
            x: Math.floor(ev.layerX / (this.inventories.getSize(item.size.x) / item.size.x)),
            y: Math.floor(ev.layerY / (this.inventories.getSize(item.size.y) / item.size.y))
        }
        this.inventories.item = this.item;
        // set drag image and data transfer 
        if(this.image){
            this.image.nativeElement.style.background = 'rgba(200,200,200,.5)';
            ev.dataTransfer.setDragImage(this.image.nativeElement, ev.layerX, ev.layerY);
        }
        ev.dataTransfer.setData('item', JSON.stringify(item));
        ev.dataTransfer.setData('inventory', this.inventoryId);
        // clear items cells to allow for placing over old cells it took up
        for(let x = 0; x < item.size.x; x ++) {
            for(let y = 0; y < item.size.y; y ++){
                if(x > 0 || y > 0){
                    let cellPos = {
                        x: x + item.pos.x,
                        y: y + item.pos.y
                    }
                    this.inventory.cells[cellPos.y][cellPos.x] = 0;
                }
            }
        }
        // hide element to not drop on itself
        setTimeout(()=>{
            this.display = 'none';
        }, 10)
    }

    @HostListener('dragover', ['$event']) onDragOver(ev: DragEvent) {
        // stop propagation to cell element
        ev.stopPropagation();
        let action = null;
        if(
            this.item.name === this.inventories.item.name
            && this.item.stackable 
            && this.item.amount < this.item.stackable
        ){
            // allow stacking
            action = 'stack';
            ev.preventDefault();
        }
        
        if(this.inventories.itemAction !== action) this.inventories.itemAction = action;
    }

    @HostListener('drop', ['$event']) onDrop(ev: DragEvent) {
        // Item being droped
        let item:Item = JSON.parse(ev.dataTransfer.getData('item'));
        ev.stopPropagation();
        // check for action to do with item dropping on item
        if(this.inventories.itemAction === 'stack'){
            let a = item.amount;
            let b = this.item.amount;

            // need to retreive inventory in case item came from another inventory
            this.inventories.getInventory(ev.dataTransfer.getData('inventory')).then((inventory: Inventory) => {
                // remove item from old inventory
                inventory.removeItem(item.id);
                
                // if old item + new item more than stacking limit
                if(b + a > item.stackable){
                    // set dropped on item to stack limit
                    this.item.amount = item.stackable;
                    item = JSON.parse(JSON.stringify(this.item));
                    item.amount = b + a - this.item.stackable;

                    // delete dropped item position and id so new inventory can assign it a spot
                    delete item.pos;
                    delete item.id;

                    this.inventory.items.push(item);
                    this.inventory.reCalc();
                }else{
                    // simple set dropped on item to new amount
                    this.item.amount += item.amount;
                }
            });
        }
    }

    @HostListener('dragend', [ '$event']) onDragEnd() {
        this.image.nativeElement.style.background = '';
        this.display = 'block';
    }

    @HostListener('contextmenu', ['$event']) onContext(ev: MouseEvent) {
        console.log(ev);
        ev.preventDefault();
        this.contextOpen = true;
        let target: HTMLElement = <HTMLElement>ev.target;
        if(target.nodeName != "ITEM") target = target.parentElement;

        //setTimeout(()=>{
            target = <HTMLElement>target.lastElementChild;
            console.log(target);
            console.log(ev.clientX, target.clientWidth, ev.clientX + target.clientWidth, window.innerWidth)
            this.contextPos = {
                x: ev.clientX + target.clientWidth + 10 > window.innerWidth ? ev.offsetX - target.clientWidth + 2 : ev.offsetX - 2,
                y: ev.offsetY - 2,
            }

        //},1)
        
    }

    onCloseContext(ev: MouseEvent) {
        console.log('Close Context', ev);
        if(this.contextOpen) this.contextOpen = false;
    }

    onContextAction(action) {
        this[action]();
    }

    constructor(private inventories: Inventories) {
        
    }

    ngOnInit() {
        this.width = this.inventories.getSize(this.item.size.x) + 'px';
        this.height = this.inventories.getSize(this.item.size.y) + 'px';
        this.inventories.getInventory(this.inventoryId).then((inventory: Inventory)=>{
            if(inventory) {
                this.inventory = inventory;
            }

            if(this.item.stackable) this.contexts.push({label: 'Split', action: 'onContextSplit'});
            if((['case', 'bag']).indexOf(this.item.type) >= 0) this.contexts.push({label: 'Open', action: 'onOpen'});
            this.contexts.push({label: 'Delete', action: 'onContextDelete'});
        })
    }

    getAmount() {
        if(this.item.amount) {
            if(this.item.amount > 999){
                return Math.round(this.item.amount / 10) / 100 + 'k';
            } else return this.item.amount;
        } else return 0;
    }

    /*
        CONTEXT ACTIONS
    */

    onContextDelete() {
        this.inventory.removeItem(this.item.id);
    }

    onContextSplit() {
        // split item stack
        let item: Item = JSON.parse(JSON.stringify(this.item));
        if (this.inventory.findSPace(item)) {
            item.amount = Math.ceil(this.item.amount / 2);
            delete item.id;
            delete item.pos;
            this.item.amount = Math.floor(this.item.amount / 2);
            this.inventory.items.push(item);
            this.inventory.reCalc();
        } else {
            console.log('No Space to Split');
        }

    }

    onOpen() {
        // open inventory window
        let id = this.item.id;
            // check if inventory is open alread
            if(this.inventories.windows.indexOf(id) < 0){
                this.inventories.getInventory(id).then((inventory)=>{
                    // inventory exists just open otherwise create new empty inventory
                    if(!inventory){
                        this.inventories.saveInventory({
                            label: this.item.name,
                            size: {
                                c: this.item.attributes.width,
                                r: this.item.attributes.height
                            },
                            items: []
                        }, id);
                    }
                    // push inventory to windows
                    this.inventories.windows.push(id);
                });
            }
    }

    /*
        CONTEXT ACTIONS END
    */
}

export interface Item {
    id?: string;
    size: {
        x: integer;
        y: integer;
    };
    pos: {
        x: integer;
        y: integer;
    }
    type: 'ammo' | 'case' | 'gun' | 'bag' | 'money';
    amount?: integer;
    stackable?: integer;
    name: string;
    attributes: Attributes;
    context: Context[];
    lore: string;
}

export interface Attributes { 
    width?: integer;
    height?: integer;
    damage?: number;
    bleeding?: number;
}

export interface Context {

}