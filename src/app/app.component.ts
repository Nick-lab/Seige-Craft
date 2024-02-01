import { Component } from '@angular/core';
import { Dungeon } from '../_game-objects/map/generators/dungeon';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Roguelike';

  constructor() {
    
  }
}
