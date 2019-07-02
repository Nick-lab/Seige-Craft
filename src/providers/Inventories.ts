import { Injectable } from "@angular/core";

@Injectable()
export class Inventories {
    private list: any = {};
    public targetIventory: String = undefined;

    public popOvers = [];

    dragging: HTMLElement = undefined;
    targetCell: HTMLElement = undefined;
    pickedUp = {x: 0,y: 0};
    pickedSize = {x: 0,y: 0};

    private inventories: any = {
        pockets: {
            label: 'Pockets',
            size: {
                c: 4,
                r: 1
            },
            items: [
                {
                    size: {
                        x: 1,
                        y: 1
                    },
                    invPos: {
                        x: 0,
                        y: 0
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
                    invPos: {
                        x: 1,
                        y: 0
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
                    invPos: {
                        x: 2,
                        y: 0
                    },
                    type: 'knife',
                    name: 'Pocket Knife',
                    attributes: {
                        damage: 30,
                        bleeding: true
                    },
                    lore: ''
                }
            ]
        },
        bag: {
            label: 'Bag',
            size: {
                c: 6,
                r: 9
            },
            items: []
        },
        bigbag: {
            label: 'Big Bag',
            size: {
                c: 10,
                r: 12
            },
            items: []
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
        return new Promise((res)=>{
            if(this.inventories[id]) res(this.inventories[id]);
            else res(false);
        })
    }

    getId () {
        return new Date().getTime().toString(36).substr(2,9);
    }
}