import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InDFormPage } from '../InD-form/InD-form';

/**
 * Generated class for the InDListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-InD-list',
  templateUrl: 'InD-list.html',
})
export class InDListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  addAssignment(){
    this.navCtrl.push(InDFormPage);
  }



}
