import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalGpsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-gps',
  templateUrl: 'modal-gps.html',
})
export class ModalGpsPage {
  coordinates: any = this.navParams.get('data');;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
  }

  closeModal(){
    this.viewCtrl.dismiss("sdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsf");
  }

  "ionic cordova plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="AIzaSyAu-ihkB7T36-bKuUzDDILMuub9Jp1_rZw" --variable API_KEY_FOR_IOS="AIzaSyBPr6eDsnUiP2RCsv_LY-hPNzNsO7JBZqI""

}
