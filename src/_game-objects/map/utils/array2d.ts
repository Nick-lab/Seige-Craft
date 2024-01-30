import { vector } from "../const";

export default class Array2d<T> {
    rows: Array<Array<T | undefined>> = [];
    size = [];

    constructor(size=[0,0], default_value:T | undefined = undefined) {

        for (let y = 0; y < size[1]; y++) {
            let row: Array<T | undefined> = [];
            for (let x = 0; x < size[0]; x++) {
                row.push(default_value);
            }
            this.rows.push(row);
        }
    }

    iter(callback: (pos: vector, is_wall: T | undefined)=>void) {
        for (let y = 0; y < this.size[1]; y++) {
            for (let x = 0; x < this.size[0]; x++) {
                callback([x, y], this.get([x, y]));
            }
        }
    }

    get([x, y]: vector) {
        if (this.rows[y] === undefined) {
            return undefined;
        }
        return this.rows[y][x];
    }

    set([x, y]: vector, val: T | undefined) {
        this.rows[y][x] = val;
    }
                     // [start_x, start_y]
    set_horizontal_line(pos: vector, delta_x: number, val: T | undefined) {
        let c = Math.abs(delta_x),
            mod = delta_x < 0 ? -1 : 1;

        for (let x=0; x <= c; x++) {
            this.set([pos[0] + x  * mod, pos[1]], val);
        }
    }
                   // [start_x, start_y]
    set_vertical_line(pos: vector, delta_y: number, val: T | undefined) {
        let c = Math.abs(delta_y),
            mod = delta_y < 0 ? -1 : 1;

        for (let y=0; y <= c; y++) {
            this.set([pos[0], pos[1] + y * mod], val);
        }
    }

    get_square([x, y]: vector, [size_x, size_y]: vector) {
        let retv = new Array2d<T>([size_x, size_y]);
        for (let dx = 0; dx < size_x; dx ++) {
            for (let dy = 0; dy < size_y; dy ++) {
                retv.set([dx, dy], this.get([x + dx, y + dy]));
            }
        }
        return retv;
    }

    set_square([x, y]: vector, [size_x, size_y]: vector, val: T | undefined, fill: boolean=false) {
        if (!fill) {
            this.set_horizontal_line([x, y], size_x - 1, val);
            this.set_horizontal_line([x, y + size_y - 1], size_x - 1, val);
            this.set_vertical_line([x, y], size_y -1, val);
            this.set_vertical_line([x + size_x - 1, y], size_y - 1, val);
        } else {
            for (let dx = 0; dx < size_x; dx ++) {
                for (let dy = 0; dy < size_y; dy ++) {
                    this.set([x + dx, y + dy], val);
                }
            }
        }
    }
}