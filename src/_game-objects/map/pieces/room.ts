import { Facings, Rooms, vector } from "../const";
import Piece, { PieceOptions } from "./piece";

export default class Room extends Piece {

  symmetric!: boolean;
  room_size!: vector;
  tag?: keyof Rooms;
  // perimeter!: Array<[vector, Facings]>
  constructor(options: RoomOptions) {

    /*
        note, size to be provided is size without walls.
        */
    options.room_size = options.size;
    options.size = [options.size![0] + 2, options.size![1] + 2];

    options = Object.assign(
      {},
      {
        symmetric: false, // if true,
      },
      options
    );

    super(options);
    
    Object.assign(this, JSON.parse(JSON.stringify(options)));
    

    // console.log(this, this.room_size);

    this.walls.set_square([1, 1], this.room_size, false, true);

    if (!this.symmetric) {
      // any point at any wall can be exit
      this.add_perimeter([2, 0], [this.size[0] - 3, 0], 180);
      this.add_perimeter([0, 2], [0, this.size[1] - 3], 90);
      this.add_perimeter(
        [2, this.size[1] - 1], 
        [this.size[0] - 3, this.size[1] - 1],
        0
      );
      this.add_perimeter(
        [this.size[0] - 1, 2],
        [this.size[0] - 1, this.size[1] - 3],
        270
      );
    } else {
      // only middle of each wall can be exit
      const [w, h] = this.get_center_pos();

      this.perimeter = [
        [[w, 0], 180],
        [[this.size[0] - 1, h], 270],
        [[w, this.size[1] - 1], 0],
        [[0, h], 90],
      ];
    }
  }

}

export interface RoomOptions extends Partial<PieceOptions> {
  room_size?: vector;
  symmetric?: boolean;
}