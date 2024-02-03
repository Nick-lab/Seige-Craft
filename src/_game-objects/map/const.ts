export const TOP = 0;
export const RIGHT = 90;
export const BOTTOM = 180;
export const LEFT = 270;

export type Facings = typeof TOP | typeof RIGHT | typeof BOTTOM | typeof LEFT;
export type vector = [number, number];
export type facing = [vector, Facings];

export const FACING: Array<Facings> = [TOP, RIGHT, BOTTOM, LEFT];

export const FACING_TO_STRING = {
    [TOP]: 'top',
    [RIGHT]: 'right',
    [BOTTOM]: 'bottom',
    [LEFT]: 'left'
};

export const FACING_TO_MOD: {
    [key: number]: vector;
} = {
    [TOP]: [0, -1],
    [RIGHT]: [1, 0],
    [BOTTOM]: [0, 1],
    [LEFT]: [-1, 0]
};

export const FACING_INVERSE: {
    [key: number]: Facings
} = {
    [TOP]: BOTTOM,
    [RIGHT]: LEFT,
    [BOTTOM]: TOP,
    [LEFT]: RIGHT
};

export const FACING_MOD_RIGHT = {
    [TOP]: RIGHT,
    [RIGHT]: BOTTOM,
    [BOTTOM]: LEFT,
    [LEFT]: TOP
};

export const FACING_MOD_LEFT = {
    [TOP]: LEFT,
    [RIGHT]: TOP,
    [BOTTOM]: RIGHT,
    [LEFT]: BOTTOM
};

import { PieceOptions } from "./pieces/piece";

export interface DungeonConfig extends Partial<PieceOptions> {
    size: vector;
    seed?: string;
    rooms?: Rooms;
    max_corridor_length?: number;
    min_corridor_length?: number;
    corridor_density?: number;
    symmetric_rooms?: boolean;
    interconnects?: number;
    max_interconnect_length?: number;
    room_count?: number;
}

export interface Rooms {
    initial: Room;
    boss: Room;
    any: Omit<Room, "position">;
}

export interface Room {
    min_size: vector;
    max_size: vector;
    max_exits?: number;
    position?: vector;
}