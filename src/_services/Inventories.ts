import { Injectable } from "@angular/core";
import { InventoryComponent } from "../_components/inventory/inventory";
import { Inventory, InventoryOptions } from "../_objects/inventory";
import { Item, items } from "src/_game-objects/items";

@Injectable()
export class Inventories {
    private list: {
        [key:string]: any
    } = {};

    public windows: string[] = [];
    public indexs = [];

    itemAction: string = '';
    picked_inventory?: string;
    item?: Item;
    pickedUp = {x: 0,y: 0};
    pickedSize = {x: 0,y: 0};

    private inventories: {
        [key:string]: InventoryOptions
    } = {
        stash: {
            id: 'stash',
            label: 'Stash',
            columns: 12,
            rows: 32,
            items: []
        }
    }

    constructor() {
        for(let [key, options] of Object.entries(this.inventories)) {
            let inv = new Inventory(options, this);
            this.list[key] = inv;
            inv.pushItem(items['pocket_knife'], 1)
            inv.pushItem(items['thicc_case'], 1)
        }
    }

    public getInventory(id: string): Inventory | undefined {
        if(this.list[id]) return this.list[id];
        else return undefined;
    }

    public submitInventory(inventory: any) {
        if(inventory.id)
        this.list[inventory.id] = inventory;
    }

    public loadInventory(id: string) {
        // eventaully wil load from local flat file
        return new Promise((res)=>{
            if(this.inventories[id]) res(this.inventories[id]);
            else res(false);
        })
    }

    public createInventory(options: InventoryOptions) {
        let inv = new Inventory(options, this);
        this.list[options.id ? options.id : this.getId()] = inv;
        return inv;
    }

    public closeWindow(id: string) {
        this.windows.forEach((window, index)=>{
            if(window == id) this.windows.splice(index, 1);
        });
    }

    public saveInventory(inventory: InventoryOptions, id: string) {
        this.list[inventory.id!] = new Inventory(inventory, this);
        this.inventories[id] = inventory;
    }

    getSize(num: number){
        return (50 * num) + (2 * (num - 1)) 
    }

    getId () {
        return new Date().getTime().toString(36).substr(2,9)+Math.random() * 99999;
    }
}