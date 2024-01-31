import {FACING_TO_MOD, Facings, vector} from '../const';

export function iter_adjacent([x, y]: vector, cb: (args: vector)=>void) {
    cb([x - 1, y]);
    cb([x, y - 1]);
    cb([x + 1, y]);
    cb([x, y + 1]);
}

export function iter_2d(size:vector, callback: (args: vector)=>void) {
    for (let y = 0; y < size[1]; y++) {
        for (let x =0; x < size[0]; x++) {
            callback([x, y]);
        }
    }
}

export function iter_range(from: vector, to: vector, callback: (args: vector)=>void) {
    let fx, fy, tx, ty;
    if(from[0]<to[0]){
        fx = from[0]; 
        tx = to[0];      
    } else {
        fx = to[0];
        tx = from[0];
    };
    if(from[1]<to[1]){
        fy = from[1]; 
        ty = to[1];      
    } else {
        fy = to[1];
        ty = from[1];
    };
    for(var x=fx;x<=tx;x++){
        for(var y=fy;y<=ty;y++){
            callback([x, y]);
        }
    } 
}

export function intersects(pos_1: vector, size_1: vector, pos_2: vector, size_2: vector) {
    return (!(pos_2[0] > pos_1[0] + size_1[0] ||
            pos_2[0] + size_2[0] < pos_1[0] ||
            pos_2[1] > pos_1[1] + size_1[1] ||
            pos_2[1] + size_2[1] < size_1[1]));
}

export function array_test<T>(array: Array<T>, test: (item: T)=>boolean) {
    for (let i = 0; i < array.length; i++) {
        if (test(array[i])) {
            return true;
        }
    }
    return false;
}

export function add(p1: vector, p2: vector) {
    return [p1[0] + p2[0], p1[1] + p2[1]] as vector;
}

export function shift(pos: vector, facing: number): vector {
    return add(pos, FACING_TO_MOD[facing]);
}

export function shift_left(pos: vector, facing: Facings) {
    return shift(pos,(facing - 90 + 360) % 360);
}

export function shift_right(pos: vector, facing: Facings) {
    return shift(pos, (facing + 90 + 360) % 360);
}