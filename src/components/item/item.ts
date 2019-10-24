import { Component, HostBinding, HostListener, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Inventories } from "../../providers/Inventories";
import { Inventory } from "../inventory/inventory";

@Component({
    selector: 'item',
    template: `
        <img #Image [src]="item.icon">
        <span class="stack" *ngIf="item.amount">{{ getAmount() }}</span>
    `
})
export class Item implements OnInit {
    private inventory: Inventory;
    @Input() inventoryId: any;
    @Input() item: Item;
    @HostBinding('style.width') width: string;
    @HostBinding('style.height') height: string;
    @HostBinding('style.opacity') opacit: number = 1;
    @HostBinding('style.zIndex') zIndex: number = 0;
    @ViewChild('Image') image: ElementRef;

    @HostListener('dblclick') onDoubleClick() {
        // open inventory window
        if((['case', 'bag']).indexOf(this.item.type) > -1) {
            let id = this.item.id;
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
                this.inventories.windows.push(id);
            });
        }
    }

    @HostListener('dragstart', ['$event']) onDrag(ev: DragEvent){
        console.log('drag start');
        // starting event listener defines starting info
        let item = this.item;
        this.inventories.pickedSize = item.size;
        this.inventories.pickedUp = {
            x: Math.floor(ev.layerX / (this.inventories.getSize(item.size.x) / item.size.x)),
            y: Math.floor(ev.layerY / (this.inventories.getSize(item.size.y) / item.size.y))
        }
        this.image.nativeElement.style.background = 'rgba(200,200,200,.5)';
        ev.dataTransfer.setDragImage(this.image.nativeElement, ev.layerX, ev.layerY);
        ev.dataTransfer.setData('item', JSON.stringify(item));
        ev.dataTransfer.setData('inventory', this.inventoryId);
        this.opacit = 0;
        //this.zIndex = -100;
    }

    @HostListener('dragover', ['$event']) onDragOver(ev: DragEvent) {
        ev.stopPropagation();
        // item drag over item
    }

    @HostListener('dragend', [ '$event']) onDragEnd() {
        this.zIndex = 0;
        this.opacit = 1;
        this.image.nativeElement.style.background = '';
    }

    constructor(private inventories: Inventories) { }

    ngOnInit() {
        this.width = this.inventories.getSize(this.item.size.x) + 'px';
        this.height = this.inventories.getSize(this.item.size.y) + 'px';
        this.inventories.getInventory(this.inventoryId).then((inventory: Inventory)=>{
            if(inventory) {
                this.inventory = inventory;
            }
        })
    }

    getAmount() {
        if(this.item.amount) {
            if(this.item.amount > 999){
                return Math.round(this.item.amount / 10) / 100 + 'k';
            } else return this.item.amount;
        } else return 0;
    }
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