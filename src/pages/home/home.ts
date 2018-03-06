import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { GeneralProvider } from '../../providers/general/general';
import { Assignment } from '../../models/assignment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController, private auth: AuthProvider, private general: GeneralProvider, private alertCtrl: AlertController) {
    this.getAssignments();
  }

  ionViewCanEnter(){
    return this.auth.authenticate();
  }

  getAssignments(){
    let alert = this.alertCtrl.create({
      title: 'Server Error',
      subTitle: 'Please contact administration.',
      buttons: ['Dismiss']
    });

    this.general.getAuthObject().then((val)=>{
      this.auth.postData(val, "api/assignment/getPDKAssignmentList").then((result) => {
        let responseData:any = result;
        if(responseData.status == "0"){
          alert.setTitle("Unauthorized Access");
          alert.setSubTitle(responseData.message);
          alert.present();
        }
        else{
          
        }
      }, 
      (err) =>{
        alert.setTitle("Server Error");
        alert.setSubTitle("Please contact administration. Error: API Error.")
        alert.present();
      });
    }).catch(error=>{ });
  }

  testing(){
    alert('success');
  }

  generateAssignmentList(assignments: any){
  }
  
}
