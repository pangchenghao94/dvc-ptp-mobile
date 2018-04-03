import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InDFormPage } from '../InD-form/InD-form';
import { AuthProvider } from '../../providers/auth/auth';
import { GeneralProvider } from '../../providers/general/general';

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
  inds: any;
  loading: any;
  authObj: any;
 
  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthProvider, private general: GeneralProvider) {
  }

  ionViewDidLoad() {}

  ionViewDidEnter(){
    this.general.getAuthObject().then((val) => {
      this.authObj = val;
      this.getIndList();
    }).catch((err) => {
      this.general.displayUnexpectedError(JSON.stringify(err));
    });
  }

  getIndList() : Promise<any>{
    this.loading = this.general.displayLoading("Loading...");
    return this.auth.postData(this.authObj, "api/ind/indList_pdk").then((result) => {
      let responseData: any = result;

      if (responseData.status == "0") {
        this.loading.dismiss();        
        this.general.displayUnauthorizedAccessAlert(responseData.message);
      }
      else {
        if (responseData.error) {
          this.loading.dismiss();          
          this.general.displayUnexpectedError(responseData.error.text);
        }
        else {
          this.inds = responseData.data;
          this.loading.dismiss();
        }
      }
    },
    (err) => {
      this.loading.dismiss();      
      this.general.displayAPIErrorAlert();
    });
  }

  indClick(ind_id){
    this.navCtrl.push("InDFormPage", {"ind_id" : ind_id, "mode": 1});
  }

  doRefresh(refresher) {
    this.getIndList()
    .then(
      (result)=>{refresher.complete();},
      (err)=>{refresher.complete();})
    .catch(err=>{
      this.general.displayUnexpectedError(err);
      refresher.complete();      
    });

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
