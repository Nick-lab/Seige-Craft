import { vector } from "./const";
import { Dungeon } from "./generators/dungeon";
import Corridor from "./pieces/corridor";
import Room from "./pieces/room";

export class Map {
    graphics: Phaser.GameObjects.Graphics;
    dungeon: Dungeon;
    tilesize = 16;
    size: vector = [200, 200];

    constructor(private scene: Phaser.Scene) {
        let dungeon = this.dungeon = new Dungeon({
            size: this.size,
            // seed: 'test',
            rooms: {
                boss: {
                    min_size: [25, 15],
                    max_size: [25, 15],
                    max_exits: 1
                },
                initial: {
                    min_size: [10, 10],
                    max_size: [10, 10],
                    max_exits: 2
                },
                any: {
                    min_size: [7, 7],
                    max_size: [15,15],
                    max_exits: 3
                }
            },
            max_corridor_length: 3,
            min_corridor_length: 1,
            corridor_density: .95,
            room_count: 10,
            interconnects: 0
        });
        
        dungeon.generate();

        this.graphics = this.scene.add.graphics({
            lineStyle: {
                color: 0xFFF
            }
        });
        for(let c of dungeon.children) {
            if(c instanceof Corridor) {
                
                // console.log('Corridor', c, `Prune: ${c.exits.length <= 1}`);
                // if(c.exits.length <= 1) continue;
                let { position, size } = c;
                if(c.prune) this.graphics.lineStyle(2, 0xff0000, .5)
                else this.graphics.lineStyle(2, 0x0fffff, .5)
                this.graphics.strokeRect(
                    (position[0] + 1) * this.tilesize, 
                    (position[1] + 1) * this.tilesize, 
                    (size[0] - 2) * this.tilesize, 
                    (size[1] - 2) * this.tilesize
                );

                c.exits.forEach((e) => {
                    // console.log(e);
                    let [pos, dir, ] = e;
                    let p = c.parent_pos(pos)
                    this.graphics.strokeRect(
                        (p[0])* this.tilesize, 
                        (p[1]) * this.tilesize, 
                        (1) * this.tilesize, 
                        (1) * this.tilesize
                    );
                })
            } else if (c instanceof Room) {
                let { position, size, exits } = c;
                // console.log({position, size, exits});
                // console.log('Room', c); 
                // if(c.exits.length <= 1) return;
                switch(c.tag) {
                    case 'initial':
                        this.graphics.lineStyle(2, 0xCCFFCC, .5);
                        break;
                    case 'boss':
                        this.graphics.lineStyle(2, 0xFF00CC, .5);
                        break;
                    default:
                        this.graphics.lineStyle(2, 0xfff, .5)
                }
                this.graphics.strokeRect(
                    (position[0] + 1 )* this.tilesize, 
                    (position[1] + 1) * this.tilesize, 
                    (size[0] - 2) * this.tilesize, 
                    (size[1] - 2) * this.tilesize
                );
                c.exits.forEach((e) => {
                    // console.log(e);
                    let [pos, dir, ] = e;
                    let p = c.parent_pos(pos)
                    this.graphics.strokeRect(
                        (p[0])* this.tilesize, 
                        (p[1]) * this.tilesize, 
                        (1) * this.tilesize, 
                        (1) * this.tilesize
                    );
                })
            }
        }
    }
}