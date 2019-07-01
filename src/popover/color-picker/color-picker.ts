import { Component } from '@angular/core';
import {NavParams } from 'ionic-angular';
@Component({
  selector: 'page-color-picker',
  templateUrl: 'color-picker.html',
})
export class ColorPickerPage {
  color:any = this.navParams.data.color;
  
  hsl: any = {
    h : 0,
    s : 100,
    l : 50
  }
  rgb: any = {
    r: 0,
    g: 0,
    b: 0
  }
  hKnob: HTMLElement;
  sBG: HTMLElement;
  sKnob: HTMLElement;
  lBG: HTMLElement;
  lKnob: HTMLElement;
  constructor(public navParams: NavParams) {}
  calcColor = () => {
    let tmpHSL = {
      h: this.hsl.h,
      s: this.hsl.s/100,
      l: this.hsl.l/100
    }
    this.color.rgb = this.rgb = this.hsl2rgb(tmpHSL);
    this.color.hex = this.toHex(this.rgb);
    let tmpColor:any = this.hsl2rgb({h:tmpHSL.h, s:1, l:.5});
    let tmpColor2:any = this.hsl2rgb({h:tmpHSL.h, s:tmpHSL.s, l:.5});
    this.hKnob.style.background = this.toHex(tmpColor);
    this.sKnob.style.background = this.toHex(tmpColor2);
    this.lKnob.style.background = this.color.hex;
    this.sBG.style.background = "linear-gradient(to right, rgb(100,100,100) 0%, rgb(" + tmpColor.r + "," + tmpColor.g + "," + tmpColor.b + "))";
    this.lBG.style.background = "linear-gradient(to right, rgb(0,0,0) 0%, rgb(" + tmpColor2.r + "," + tmpColor2.g + "," + tmpColor2.b + ") 50%, rgb(255,255,255))";
  }
  toHex(c) {
    let t = {
      r: '00',
      g: '00',
      b: '00'
    }
    t.r = c.r.toString(16).slice(-2);
    t.r = t.r.length == 1 ? "0" + t.r : t.r;
    t.g = c.g.toString(16).slice(-2);
    t.g = t.g.length == 1 ? "0" + t.g : t.g;
    t.b = c.b.toString(16).slice(-2);
    t.b = t.b.length == 1 ? "0" + t.b : t.b;
    return "#" + t.r + t.g + t.b;
  }
  hsl2rgb = (hsl) => {
    if (hsl.h == undefined) {
      return [0, 0, 0];
    }
    var chroma = (1 - Math.abs((2 * hsl.l) - 1)) * hsl.s;
    var huePrime = hsl.h / 60;
    var secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));
    huePrime = Math.floor(huePrime);
    var red;
    var green;
    var blue;
    if (huePrime === 0) {
      red = chroma;
      green = secondComponent;
      blue = 0;
    } else if (huePrime === 1) {
      red = secondComponent;
      green = chroma;
      blue = 0;
    } else if (huePrime === 2) {
      red = 0;
      green = chroma;
      blue = secondComponent;
    } else if (huePrime === 3) {
      red = 0;
      green = secondComponent;
      blue = chroma;
    } else if (huePrime === 4) {
      red = secondComponent;
      green = 0;
      blue = chroma;
    } else if (huePrime === 5) {
      red = chroma;
      green = 0;
      blue = secondComponent;
    }
    var lightnessAdjustment = hsl.l - (chroma / 2);
    red += lightnessAdjustment;
    green += lightnessAdjustment;
    blue += lightnessAdjustment;
    return { r: Math.round(red * 255), g: Math.round(green * 255), b: Math.round(blue * 255) };
  }
  RGBToHSL(rgb) {
    rgb.r /= 255, rgb.g /= 255, rgb.b /= 255;
    var max = Math.max(rgb.r, rgb.g, rgb.b), min = Math.min(rgb.r, rgb.g, rgb.b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case rgb.r: h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0); break;
        case rgb.g: h = (rgb.b - rgb.r) / d + 2; break;
        case rgb.b: h = (rgb.r - rgb.g) / d + 4; break;
      }

      h /= 6;
    }
    return {h:h*359, s:s*100, l:l*100};
  }
  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  ionViewDidLoad() {
    this.rgb = this.hexToRgb(this.color.hex);
    this.hsl = this.RGBToHSL(this.hexToRgb(this.color.hex));
    this.hKnob = document.querySelector('#hue .range-knob');
    this.sBG = document.querySelector('#saturation .range-bar');
    this.sKnob = document.querySelector('#saturation .range-knob');
    this.lBG = document.querySelector('#light .range-bar');
    this.lKnob = document.querySelector('#light .range-knob');
    this.calcColor();
  }
}
