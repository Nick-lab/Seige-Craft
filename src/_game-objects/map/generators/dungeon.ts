import Generator from "./generator";
import Corridor from "../pieces/corridor";
import Room from "../pieces/room";
import { FACING, Facings, facing, vector, DungeonConfig, Rooms } from "../const";
import { shift_left, shift_right, shift } from "../utils";
import Piece from "../pieces/piece";

export class Dungeon extends Generator {

  room_tags!: Array<keyof Rooms>
  rooms!: Rooms;
  // corridors: Array<Corridor>;
  room_count!: number;
  symmetric_rooms!: boolean;
  initial_room?: Room;
  corridor_density!: number;
  max_iterations!: number;
  min_corridor_length!: number;
  max_corridor_length!:number;
  interconnects!: number;
  max_interconnect_length!: number

  declare options: DungeonConfig;

  constructor(options: DungeonConfig) {
    options = Object.assign(
      {},
      {
        max_iterations: 50,
        size: [100, 100],
        rooms: {
          initial: {
            min_size: [3, 3],
            max_size: [3, 3],
            max_exits: 1,
          },
          any: {
            min_size: [2, 2],
            max_size: [5, 5],
            max_exits: 4,
          },
        },
        max_corridor_length: 6,
        min_corridor_length: 2,
        corridor_density: 0.5, // corridors per room
        symmetric_rooms: false, // exits must be in the middle of walls
        interconnects: 1, // extra corridors to connect rooms and make circular paths. not guaranteed
        max_interconnect_length: 10,
        room_count: 10,
      },
      options
    );

    
    super(options);
    Object.assign(this, JSON.parse(JSON.stringify(options)));
    console.log('[Dungeon]:', options, this.rooms);
    
    this.room_tags = options.rooms ? <Array<keyof Rooms>>Object.keys(options.rooms).filter(
      (tag) => tag !== "any" && tag !== "initial" && tag !== "boss"
    ) : [];

    for (let i = this.room_tags.length; i < this.room_count; i++) {
      this.room_tags.push("any");
    }

    // this.rooms = [];
    // this.corridors = [];
  }

  add_room(room: Room, exit?: facing, add_to_room?: Piece) {
    let log = room.tag === 'boss';
    // add a new piece, exit is local perimeter pos for that exit;
    let choices, old_room;
    // pick a placed room to connect this piece to
    if (add_to_room) {
      old_room = add_to_room;
      add_to_room = undefined;
    } else {
      choices = this.get_open_pieces(this.children);
      if(log) console.log(choices);
      if (choices && choices.length) {
        old_room = this.random.choose(choices);
      } else {
        console.log("ran out of choices connecting");
        return false;
      }
    }

    // if exit is specified, try joining  to this specific exit
    if (exit) {
      // try joining the rooms
      if (this.join(old_room, exit, room)) {
        return true;
      }
      // else try all perims to see
    } else {
      const perim = room.perimeter.slice();
      while (perim.length) {
        if (this.join(old_room, this.random.choose(perim, true), room)) {
          return true;
        }
      }
    }

    return false;
  }

  new_corridor() {
    return new Corridor({
      length: this.random.int(
        this.min_corridor_length,
        this.max_corridor_length
      ),
      facing: this.random.choose(FACING),
    });
  }

  add_interconnect() {
    const perims: {[key:string]: [facing, Piece]} = {};
    let hash;
    let exit;
    let p: vector;

    // hash all possible exits
    this.children.forEach((child) => {
      if (child.exits.length < child.max_exits) {
        child.perimeter.forEach((exit) => {
          p = child.parent_pos(exit[0]);
          hash = `${p[0]}_${p[1]}`;
          perims[hash] = [exit, child];
        });
      }
    });

    // search each room for a possible interconnect, backwards
    let room, length, corridor, room2;
    for (let i = this.children.length - 1; i--; i >= 0) {
      room = this.children[i];

      // if room has exits available
      if (room.exits.length < room.max_exits) {
        // iterate exits
        for (let k = 0; k < room.perimeter.length; k++) {
          exit = room.perimeter[k];
          p = room.parent_pos(exit[0]);
          length = -1;

          // try to dig a tunnel from this exit and see if it hits anything
          while (length <= this.max_interconnect_length) {
            // check if space is not occupied
            if (
              !this.walls.get(p) ||
              !this.walls.get(shift_left(p, exit[1])) ||
              !this.walls.get(shift_right(p, exit[1]))
            ) {
              break;
            }
            hash = `${p[0]}_${p[1]}`;

            // is there a potential exit at these coordiantes (not of the same room)
            if (perims[hash] && perims[hash][1].id !== room.id) {
              room2 = perims[hash][1];

              // rooms cant be joined directly, add a corridor
              if (length > -1) {
                corridor = new Corridor({
                  length,
                  facing: exit[1],
                });

                if (this.join(room, corridor.perimeter[0], corridor, exit)) {
                  this.join_exits(
                    room2,
                    perims[hash][0],
                    corridor,
                    corridor.perimeter[corridor.perimeter.length - 1]
                  );
                  return true;
                } else {
                  return false;
                }
                // rooms can be joined directly
              } else {
                this.join_exits(room2, perims[hash][0], room, exit);
                return true;
              }
            }

            // exit not found, try to make the interconnect longer
            p = shift(p, exit[1]);
            length++;
          }
        }
      }
    }

    return true;
  }

  new_room(key?: keyof Rooms) {
    // spawn next room
    let symmetric = this.symmetric_rooms;

    if(key === 'boss') symmetric = true;

    key = key ? key : this.random.choose(this.room_tags, false);
    if(!key) key = 'any';
    const opts = this.rooms[key];
    // console.log({opts, rooms: this.rooms.boss, key});
    
    const room = new Room({
      size: this.random.vec(opts.min_size, opts.max_size),
      max_exits: opts.max_exits,
      symmetric,
      tag: key,
    });

    this.room_tags.splice(this.room_tags.indexOf(key), 1);

    if (key === "initial") {
      this.initial_room = room;
    }
    return room;
  }

  override generate() {
    let no_rooms = this.options.room_count! - 1;

    const room = this.new_room(
      this.options.rooms!.initial ? "initial" : undefined
    );
    let no_corridors = Math.round(this.corridor_density * no_rooms);
    
    this.add_piece(
      room,
      this.options.rooms!.initial?.position
        ? this.options.rooms!.initial.position
        : this.get_center_pos()
    );

    let k;
    let iterations = this.max_iterations;

    while ((no_corridors || no_rooms) && --iterations) {
      k = this.random.int(1, no_rooms + no_corridors);
      if (k <= no_corridors) {
        const corridor = this.new_corridor();
        const added = this.add_room(corridor, corridor.perimeter[0]);
        no_corridors--;

        // try to connect to this corridor next
        if (no_rooms > 0 && added) {
          this.add_room(this.new_room(), undefined, corridor);
          no_rooms--;
        }
      } else {
        this.add_room(this.new_room());
        no_rooms--;
      }
    }

    if(this.options.rooms?.boss) {
      let opts = this.options.rooms.boss
      const boss = this.new_room("boss")
      
      this.add_room(
        boss,
        
      )
    }

    for (k = 0; k < this.interconnects; k++) {
      this.add_interconnect();
    }

    // for(let child of this.children) {
    //   console.log(child);
      
    // }
    

    this.trim();

    if (this.initial_room) {
      this.start_pos = this.initial_room.global_pos(
        this.initial_room.get_center_pos()
      );
    }
    return iterations > 0;
  }
}

export const getMapMaxX = (data: any) =>
  (data && data.length && data[0].length) || 0;

export const getMapMaxY = (data: any) => (data && data.length) || 0;

export const scaleArray = (array: Array<any>, scaleX = 1, scaleY = scaleX) => {
  const sizeX = scaleX * getMapMaxX(array);
  const sizeY = scaleY * getMapMaxY(array);

  return Array.from({ length: sizeY }, (_, y) =>
    Array.from(
      { length: sizeX },
      (_, x) => array[Math.floor(y / scaleY)][Math.floor(x / scaleX)]
    )
  );
};

export const createDungeon = (size: number, scale: number = 1, options: DungeonConfig) => {
  const dungeon = new Dungeon(
    size
      ? Object.assign(
          {
            size: [size, size],
            room_count: size,
          },
          options
        )
      : options
  );

  dungeon.generate();

  return scale === 1
    ? dungeon.walls.rows
    : scaleArray(dungeon.walls.rows, scale);
};
