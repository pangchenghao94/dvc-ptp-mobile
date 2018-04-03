import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { GeneralProvider } from '../../../providers/general/general';

/**
 * Generated class for the ModalSek5Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-sek5',
  templateUrl: 'modal-sek5.html',
})
export class ModalSek5Page {
  minDate: any;
  maxDate: any;
  sek5Form: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private viewCtrl: ViewController, private general: GeneralProvider) {
    this.sek5Form = this.fb.group({
      sek5_id: '',
      date: ['', Validators.required],
      time: ['', Validators.required],
      remark: ''
    });
  }

  ionViewDidLoad() {  }

  ionViewDidEnter(){
    if(this.navParams.get("sek5Data") != null){
      let sek5Data = this.navParams.get("sek5Data");
      this.sek5Form.patchValue({
        sek5_id: sek5Data.sek5_id,
        date: sek5Data.date,
        time: sek5Data.time,
        remark: sek5Data.remark
      });  
    }

    //initialise the date picker
    let temp_minDate: Date = new Date();
    temp_minDate = this.general.convertToDateOnly(temp_minDate);
    this.minDate = temp_minDate.toISOString();

    let temp_maxDate: Date = new Date();
    temp_maxDate.setMonth(new Date().getMonth() + 2);
    this.maxDate = temp_maxDate.toISOString();
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  saveSek5(){
    let dismissData = {
      sek5_id:  this.sek5Form.get("sek5_id").value,
      date: this.sek5Form.get("date").value,
      time: this.sek5Form.get("time").value,
      remark: this.sek5Form.get("remark").value,
    }
    this.viewCtrl.dismiss(dismissData);
  }
}
