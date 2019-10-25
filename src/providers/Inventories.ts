import { Injectable } from "@angular/core";
import { Item } from "../components/item/item";

@Injectable()
export class Inventories {
    private list: any = {};

    public windows = [];
    public indexs = [];

    itemAction = '';
    item: Item;
    pickedUp = {x: 0,y: 0};
    pickedSize = {x: 0,y: 0};

    private inventories: any = {
        stash: {
            label: 'Stash',
            size: {
                c: 12,
                r: 32
            },
            items: [
                {
                    size: {
                        x: 1,
                        y: 1
                    },
                    type: 'ammo',
                    amount: 10,
                    stackable: 60,
                    name: '5.56 Nato',
                    attributes: {
                        health: 20,
                        bleeding: false
                    },
                    context: [
                        {
                            label: "Use"
                        }
                    ],
                    lore: ''
                },
                {
                    size: {
                        x: 1,
                        y: 1
                    },
                    type: 'ammo',
                    amount: 10,
                    stackable: 60,
                    name: '5.56 Nato',
                    attributes: {
                        health: 20,
                        bleeding: false
                    },
                    context: [
                        {
                            label: "Use"
                        }
                    ],
                    lore: ''
                },
                {
                    size: {
                        x: 1,
                        y: 1
                    },
                    type: 'ammo',
                    amount: 50,
                    stackable: 60,
                    name: '5.56 Nato',
                    attributes: {
                        health: 20,
                        bleeding: false
                    },
                    context: [
                        {
                            label: "Use"
                        }
                    ],
                    lore: ''
                },
                {
                    size: {
                        x: 1,
                        y: 1
                    },
                    type: 'ammo',
                    amount: 10,
                    stackable: 60,
                    name: '5.56 Nato',
                    attributes: {
                        health: 20,
                        bleeding: false
                    },
                    context: [
                        {
                            label: "Use"
                        }
                    ],
                    lore: ''
                },
                {
                    size: {
                        x: 1,
                        y: 1
                    },
                    type: 'money',
                    amount: 30000,
                    stackable: 50000,
                    name: 'Dollars',
                    icon: 'assets/game_assets/icons/dollars.png',
                    attributes: {
                        health: 20,
                        bleeding: false
                    },
                    context: [
                        {
                            label: "Use"
                        }
                    ],
                    lore: ''
                },
                {
                    size: {
                        x: 1,
                        y: 1
                    },
                    type: 'money',
                    amount: 40000,
                    stackable: 50000,
                    name: 'Dollars',
                    icon: 'assets/game_assets/icons/dollars.png',
                    attributes: {
                        health: 20,
                        bleeding: false
                    },
                    context: [
                        {
                            label: "Use"
                        }
                    ],
                    lore: ''
                },
                {
                    size: {
                        x: 1,
                        y: 1
                    },
                    type: 'medical',
                    name: 'Bandage',
                    attributes: {
                        health: 20,
                        bleeding: false
                    },
                    context: [
                        {
                            label: "Use"
                        }
                    ],
                    lore: ''
                },
                {
                    size: {
                        x: 1,
                        y: 1
                    },
                    type: 'medical',
                    name: 'Bandage',
                    attributes: {
                        health: 20,
                        bleeding: false
                    },
                    context: [
                        {
                            label: "Use"
                        },
                        {
                            label: "Discard"
                        }
                    ],
                    lore: ''
                },
                {
                    size: {
                        x: 2,
                        y: 1
                    },
                    type: 'knife',
                    name: 'Pocket Knife',
                    icon: 'assets/game_assets/icons/knife.jpg',
                    attributes: {
                        damage: 30,
                        bleeding: true
                    },
                    lore: ''
                },
                {
                    size: {
                        x: 4,
                        y: 2
                    },
                    type: 'gun',
                    name: 'MP5',
                    icon: 'assets/game_assets/icons/mp5.png',
                    attributes: {
                        damage: 30,
                        bleeding: true
                    },
                    lore: ''
                },
                {
                    size: {
                        x: 5,
                        y: 2
                    },
                    type: 'gun',
                    name: 'M4A1',
                    icon: 'assets/game_assets/icons/m4a1.png',
                    attributes: {
                        damage: 30,
                        bleeding: true
                    },
                    lore: ''
                },
                {
                    size: {
                        x: 6,
                        y: 2
                    },
                    type: 'gun',
                    name: 'SKS',
                    icon: 'assets/game_assets/icons/sks.png',
                    attributes: {
                        damage: 30,
                        bleeding: true
                    },
                    lore: ''
                },
                {
                    size: {
                        x: 5,
                        y: 3
                    },
                    type: 'case',
                    name: 'T H I C C',
                    icon: 'assets/game_assets/icons/thicc.png',
                    attributes: {
                        width: 14,
                        height: 14
                    },
                    lore: ''
                },
                {
                    size: {
                        x: 4,
                        y: 6
                    },
                    type: 'bag',
                    name: 'Scrapper Bag',
                    icon: 'assets/game_assets/icons/bag.png',
                    attributes: {
                        width: 5,
                        height: 6
                    },
                    lore: ''
                },
                {
                    size: {
                        x: 4,
                        y: 6
                    },
                    type: 'bag',
                    name: 'Scrapper Bag',
                    icon: 'assets/game_assets/icons/bag.png',
                    attributes: {
                        width: 5,
                        height: 6
                    },
                    lore: ''
                },
                {
                    size: {
                        x: 4,
                        y: 6
                    },
                    type: 'bag',
                    name: 'Scrapper Bag',
                    icon: 'assets/game_assets/icons/bag.png',
                    attributes: {
                        width: 5,
                        height: 6
                    },
                    lore: ''
                },
                {
                    size: {
                        x: 5,
                        y: 2
                    },
                    type: 'case',
                    name: 'Weapon Case',
                    icon: 'assets/game_assets/icons/large_gun_case.png',
                    attributes: {
                        width: 10,
                        height: 5,
                        filters: ['gun','magazine','ammo']
                    },
                    lore: ''
                },
                {
                    size: {
                        x: 4,
                        y: 3
                    },
                    type: 'bag',
                    name: 'Duffle Bag',
                    icon: 'assets/game_assets/icons/duffle_bag.png',
                    attributes: {
                        width: 4,
                        height: 4,
                    },
                    lore: ''
                }
            ]
        }
    }

    constructor() { }

    public getInventory(id) {
        return new Promise((res)=>{
            if(this.list[id]) res(this.list[id]);
            else res(false)
        })
    }

    public submitInventory(inventory) {
        this.list[inventory.id] = inventory;
    }

    public loadInventory(id: string) {
        // eventaully wil load from local flat file
        return new Promise((res)=>{
            if(this.inventories[id]) res(this.inventories[id]);
            else res(false);
        })
    }

    public createInventory(options) {
        return new Promise((res)=>{
            this.inventories[options.id] = {
                    label: options.label,
                    size: {
                        c: options.width,
                        r: options.height
                    },
                    filters: options.filters,
                    items: []
            }
            res();
        })
    }

    public closeWindow(id) {
        this.windows.forEach((window, index)=>{
            if(window == id) this.windows.splice(index, 1);
        });
    }

    public saveInventory(inventory, id){
        this.inventories[id] = inventory;
    }

    getSize(num){
        return (30 * num) + (2 * (num - 1)) 
    }

    getId () {
        return new Date().getTime().toString(36).substr(2,9)+Math.random() * 99999;
    }
}