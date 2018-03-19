import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class GeneralProvider {

  constructor(public http: HttpClient, private storage: Storage, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
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
  getPasswordPattern(): string{
    return "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,25}$";
  }

  getGenderStr(gender: any) : string{
    if(gender == 0)
      return "Female";
    else if(gender == 1)
      return "Male";
    else
      return "error"; 
  }

  getUserTypeDesc(userType: any) : string{
    if(userType == 0)
      return "Superadmin";
    else if(userType == 1)
      return "Admin";
    else if(userType == 2)
      return "Inspector";
    else if(userType == 3)
      return "PDK";
    else if(userType == 4)
      return "Clerk";
    else
      return "error"; 
  }

  getUserID(){
    return this.storage.get('userData').then((val) => {
      return val.user_id;
    });
  }

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

  displayAPIErrorAlert(){
    let alert = this.alertCtrl.create({
      title: "Server Error",
      message: "Please contact administration. Error: API Error.",
      buttons: ['Dismiss']
    });
    alert.present();
  }

  displayUnauthorizedAccessAlert(message){
    let alert = this.alertCtrl.create({
      title: "Unauthorized Access",
      message: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  displayUnexpectedError(error: any){
    let alert = this.alertCtrl.create({
      title: "Unexpected Error",
      message: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  displayLoading(message?: string){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: message
    });
  
    loading.present();
    return loading;
  }

  displayToast(text){
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  displayConfirm(title: string, message: string, confirmHandler) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: confirmHandler
        }
      ]
    });
    alert.present();
  }
}
