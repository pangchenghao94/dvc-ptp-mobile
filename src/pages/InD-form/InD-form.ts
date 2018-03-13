import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalGpsPage } from '../modal/modal-gps/modal-gps';
import { GeneralProvider } from '../../providers/general/general';

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
  isModal: boolean;
  mode: number; //add = 0 , 1 = edit

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private modalCtrl: ModalController, 
    private general: GeneralProvider) {

    this.InDForm = this.fb.group({ 
      assignment_id: '',
      premise_close: '',
      premise_empty: '',
      poName: ['', Validators.required],
      poID: '',
      pShortAddr: '',
      no_familyMember: '',
      no_fever: '',
      no_out_breeding: '',
      no_in_breeding: '',
      container_type: '',
      no_pot_out_breeding: '',
      no_pot_in_breeding: ''
    });
  }

  ionViewDidLoad() {
    this.InDForm.patchValue({assignment_id: this.navParams.get('id')});
    this.mode = this.navParams.get('mode');
  }

  openGPSModal(){
    let gpsModal = this.modalCtrl.create(ModalGpsPage, {"coordinates" : this.coordinate});
    gpsModal.onDidDismiss(data=>{
      this.isModal = false;
      this.coordinate = data;
    });

    this.isModal = true;
    gpsModal.present();
  }

}
