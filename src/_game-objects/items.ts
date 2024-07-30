export enum ItemType {
    Knife = 1,
    Gun,
    Bag,
    Case
}

export const items: {
    [key: string]: Item
} = {
    'pocket_knife': {
        size: {
            x: 2,
            y: 1
        },
        type: ItemType.Knife,
        name: 'pocket_knife',
        label: 'Pocket Knife',
        icon: 'assets/game_assets/icons/knife.jpg',
        attributes: {
            damage: 30,
            bleeding: 5
        },
        lore: ''
    },
    'thicc_case': {
        size: {
            x: 5,
            y: 3
        },
        type: ItemType.Case,
        name: 'thicc_case',
        label: 'T H I C C',
        icon: 'assets/game_assets/icons/thicc.png',
        attributes: {
            width: 14,
            height: 14
        },
        lore: ''
    }
}

export interface Item {
    id?: string;
    size: {
        x: number;
        y: number;
    };
    pos?: {
        x: number;
        y: number;
    }
    type: ItemType;
    amount?: number;
    stackable?: number;
    name: string;
    label: string;
    attributes: Attributes;
    context?: Context[];
    lore: string;
    icon: string;
}

export interface Attributes { 
    width?: number;
    height?: number;
    fuel?: number;
    damage?: number;
    bleeding?: number;
}

export interface Context {
    label: string;
    action: Function;
}