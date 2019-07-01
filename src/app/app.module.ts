import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { GamePage } from '../pages/home/game/game';
import { ColorPickerPage } from '../popover/color-picker/color-picker';

import { ElectronProvider } from '../providers/electron/electron';
import { HttpClientModule } from '@angular/common/http';
import { DataManager } from '../providers/DataManager';
import { Map } from '../providers/map';

console.log(DataManager);

var config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GamePage,
    ColorPickerPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GamePage,
    ColorPickerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ElectronProvider,
    DataManager,
    Map
  ]
})
export class AppModule {}
