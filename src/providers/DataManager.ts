import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class DataManager {

  public tabs: boolean = false;

  server: string = 'http://localhost:3000';
  host: string = 'http://localhost:3000';
  ep: string = this.server + '/api';

  constructor(
    public http: HttpClient,
    private alertCtrl: AlertController
  ) {
    
  }
  
  save(key, data){
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  load(key) {
    if(localStorage.getItem(key) != null){
      return JSON.parse(localStorage.getItem(key));
    }else{
      return false;
    }
  }

  dataError(res) {
    let alert = this.alertCtrl.create({
      title: 'Data Error',
      message: JSON.stringify(res),
      buttons: ['CLOSE']
    });
    alert.present();
  }

  serverError() {
    let alert = this.alertCtrl.create({
      title: 'Server Error',
      message: 'Unable to Connect to Server. Please Check Your Internet Connection',
      buttons: ['CLOSE']
    });
    alert.present();
  }
  
  post(command, data, triggerError: boolean = true) {

    let tmp = {
      command,
      data
    }
    let headers = {
      headers: { 'content-type': "application/json" }
    };
    return new Promise((resolve, reject) => {
      this.http.post(this.ep, JSON.stringify(tmp), headers).toPromise().then((response: any) => {
        if (triggerError) {
          if (response.result == 'success') resolve(response);
          else this.dataError(response);
        } else {
          resolve(response);
        }
      }).catch((error) => {
        if (triggerError) this.serverError();
      });
    });
  }

}
