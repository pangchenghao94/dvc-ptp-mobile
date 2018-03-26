import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { GeneralProvider } from '../../../providers/general/general';

/**
 * Generated class for the ModalSek8Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-sek8',
  templateUrl: 'modal-sek8.html',
})
export class ModalSek8Page {
  sek8Form: any;
  minDate: any;
  maxDate: any;
  defaultDate: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private fb: FormBuilder, private general: GeneralProvider) {
    //initialise the date picker
    let temp_minDate: Date = new Date();
    temp_minDate = this.general.convertToDateOnly(temp_minDate);
    this.minDate = temp_minDate.toISOString();

    let temp_maxDate: Date = new Date();
    temp_maxDate.setMonth(new Date().getMonth() + 2);
    this.maxDate = temp_maxDate.toISOString();

    let temp_defaultDate: Date = new Date();
    temp_defaultDate.setDate(new Date().getDate() + 3);
    this.defaultDate = temp_defaultDate.toISOString();
    
    this.sek8Form = this.fb.group({
      checking_date: this.defaultDate,
      chkbx1: [false, Validators.required],
      chkbx2: [false, Validators.required],
      chkbx3: [false, Validators.required],
      chkbx4: [false, Validators.required],
      chkbx5: [false, Validators.required],
      chkbx6: [false, Validators.required],
      chkbx7: [false, Validators.required],
      chkbx8: [false, Validators.required],
      chkbx9: [false, Validators.required],
      chkbx10: [false, Validators.required],
      chkbx11: [false, Validators.required],
      chkbx12: [false, Validators.required],
      chkbx13: [false, Validators.required],
      remark: ''      
      
    });
  }

  ionViewDidLoad() {  }

  ionViewDidEnter(){
   if(this.navParams.get("sek8Data") != null){
    let sek8Data = this.navParams.get("sek8Data");
    this.sek8Form.patchValue({
      checking_date: sek8Data.checking_date,
      chkbx1: sek8Data.chkbx1,
      chkbx2: sek8Data.chkbx2,
      chkbx3: sek8Data.chkbx3,
      chkbx4: sek8Data.chkbx4,
      chkbx5: sek8Data.chkbx5,
      chkbx6: sek8Data.chkbx6,
      chkbx7: sek8Data.chkbx7,
      chkbx8: sek8Data.chkbx8,
      chkbx9: sek8Data.chkbx9,
      chkbx10: sek8Data.chkbx10,
      chkbx11: sek8Data.chkbx11,
      chkbx12: sek8Data.chkbx12,
      chkbx13: sek8Data.chkbx13,
      remark: sek8Data.remark
    });
   }
  }

  closeModal(exhibit_id?: any){
    this.viewCtrl.dismiss();
  }

  saveSek8(){
    let dismissData = {
      checking_date: this.sek8Form.get("checking_date").value,    
      chkbx1: this.sek8Form.get("chkbx1").value,
      chkbx2: this.sek8Form.get("chkbx2").value,
      chkbx3: this.sek8Form.get("chkbx3").value,
      chkbx4: this.sek8Form.get("chkbx4").value,
      chkbx5: this.sek8Form.get("chkbx5").value,
      chkbx6: this.sek8Form.get("chkbx6").value,      
      chkbx7: this.sek8Form.get("chkbx7").value,
      chkbx8: this.sek8Form.get("chkbx8").value,
      chkbx9: this.sek8Form.get("chkbx9").value,
      chkbx10: this.sek8Form.get("chkbx10").value,
      chkbx11: this.sek8Form.get("chkbx11").value,
      chkbx12: this.sek8Form.get("chkbx12").value,
      chkbx13: this.sek8Form.get("chkbx13").value,
      remark: this.sek8Form.get("remark").value,      
    }

    this.viewCtrl.dismiss(dismissData);
  }
}
