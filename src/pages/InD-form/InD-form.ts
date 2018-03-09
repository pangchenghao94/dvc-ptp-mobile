import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalGpsPage } from '../modal/modal-gps/modal-gps';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the InDFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-InD-form',
  templateUrl: 'InD-form.html',
})
export class InDFormPage {
  InDForm: any;
  coordinate: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private modalCtrl: ModalController, private geoLocation: Geolocation) {
    this.InDForm = this.fb.group({
      postcode: ['', Validators.required],
      gps_location: ''
    });

    this.geoLocation.getCurrentPosition().then((result) => {
      this.coordinate = result.coords;
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  ionViewDidLoad() {
  }

  openGPSModal(){
    let gpsModal = this.modalCtrl.create(ModalGpsPage, {"data": this.coordinate});

    gpsModal.onDidDismiss(data=>{
      console.log(data);
    });
    
    gpsModal.present();
    
  }

}
