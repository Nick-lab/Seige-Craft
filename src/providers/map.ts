import { Injectable } from '@angular/core';
import { Noise } from 'noisejs';

@Injectable()
export class Map {
  noise: any;

  constructor() {

  }

  generate = (size = { x: 1, y: 1 }, scale, cut, ground = { height: 150, amp: 50 }) => {
    let map = [];
    // create off-screen canvas element
    let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

    canvas.width = size.x;
    canvas.height = size.y;
    
    // create imageData object
    let idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = idata.data;

    let groundLayer = [];
    for (let x = 0; x < size.x; x++) {
      groundLayer[x] = Math.floor((Math.abs(this.noise.simplex2(x / (scale * 2), ground.height / (scale * 2))) * (ground.amp / 4)) + ground.height);
      groundLayer[x] += Math.floor((Math.abs(this.noise.simplex2(x / (scale / 4), ground.height / (scale / 4))) * (ground.amp / 2)));
    }
    console.log('ground', groundLayer);
    
    for (let x = 0; x < size.x; x++) {
      for (let y = 0; y < size.y; y++) {
        let i = (x + (size.x * y)) * 4;

        if (y > groundLayer[x]) {
          let val = Math.abs(this.noise.simplex2(x / scale, y / scale));
          val = val > cut ? 0 : 1;

          map[i] = val;
          data[i] = val * 255;
          data[i + 1] = val * 255;
          data[i + 2] = val * 255;
          data[i + 3] = 255;
        } else {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 255;
        }
      }
    }


    ctx.putImageData(idata, 0, 0);

    var dataUri = canvas.toDataURL();

    return { raw: map, image: dataUri };
  }

  init = (seed) => {
    if (this.noise) {
      this.noise.seed(Math.random())
    } else {
      this.noise = new Noise(Math.random());
    }
    
  }
}
