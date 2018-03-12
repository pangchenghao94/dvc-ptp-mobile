import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalUpdateUserDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-update-user-details',
  templateUrl: 'modal-update-user-details.html',
})
export class ModalUpdateUserDetailsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalUpdateUserDetailsPage');
  }

  updateUser(){
    this.viewCtrl.dismiss();
  }

  cancel(){
    this.viewCtrl.dismiss();
  }

}
