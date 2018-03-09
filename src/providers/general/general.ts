import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

@Injectable()
export class GeneralProvider {

  constructor(public http: HttpClient, private storage: Storage, private alertCtrl: AlertController) {
  }

  // generateJSONObj(key, value){
  //   let counter = 0;
  //   let data: any = {};

  //   key.forEach(element => {
  //     console.log(element);
  //     data. = value[counter];
  //     counter ++;
  //   });

  //   console.log(data);
  //   return data;
  // }

  getAuthObject(){
    return this.storage.get('userData').then((val) => {
      let data: any = {   "token"     : val.token,
                          "user_id"   : val.user_id};
      return data;
    });
  }

  displayAlert(title:string, message: string){
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
