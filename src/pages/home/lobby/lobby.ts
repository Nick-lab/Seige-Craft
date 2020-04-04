import { Component } from "@angular/core";
import { Events, NavController } from "ionic-angular";
import { ElectronProvider } from "../../../providers/electron/electron";
import { GamePage } from '../game/game';

@Component({
    selector: 'page-lobby',
    templateUrl: 'lobby.html'
})
export class LobbyPage{
    constructor(
        private events: Events, 
        private electron: ElectronProvider,
        private nav: NavController) {

    }

    onPlay() {
        this.nav.push(GamePage);
    }

    ionViewDidEnter() {
        //this.socket.connect();
        this.events.publish('window:title', { title: 'Lobby' });
        this.electron.setActivity({
          details: `Waiting In Lobby`,
          state: 'Teammates',
          largeImageKey: 'seige-standing',
          largeImageText: 'Project Seige',
          smallImageKey: 'seige',
          smallImageText: 'Project Seige',
          partyId: 'testing does not work',
          partySize: 1,
          partyMax: 5,
          joinSecret: (Math.random() * 10000000).toString(32),
          instance: false,
        });
      }
}