import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { GeneralProvider } from '../../providers/general/general';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user : User = new User();
  loading: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private general: GeneralProvider, private auth: AuthProvider, 
    private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.getUser();
  }

  getUser(){
    this.loading = this.general.displayLoading("Loading...");
    this.general.getAuthObject().then((val)=>{
      this.auth.postData(val, "api/user/get/" + val.user_id).then((result) => {
        let user : any = result;
                    
        if(user.status == "0"){
          this.general.displayUnauthorizedAccessAlert(user.message);
        }
        else{
          if(user.error) {
            this.general.displayUnexpectedError(user.error.text);
          }
          else{
            this.user.user_id = val.user_id;
            this.user.full_name = user.data.full_name;
            this.user.username = user.data.username;
            this.user.phone_no = user.data.phone_no;
            this.user.email = user.data.email;
            this.user.usertypeStr = this.general.getUserTypeDesc(user.data.usertype);
            this.user.gender = user.data.gender;
          }
        }
        this.loading.dismiss();
      }, 
      (err) =>{
        this.general.displayAPIErrorAlert();
        this.loading.dismiss();
      });
    })
    .catch((err) => {
        this.general.displayUnexpectedError(err);
        this.loading.dismiss();
      }
    );
  }

  updateDetails(){
    let updateUserDetailsModal = this.modalCtrl.create("ModalUpdateUserDetailsPage", {"user" : this.user});

    updateUserDetailsModal.onDidDismiss(data=>{
      this.getUser();
    });

    updateUserDetailsModal.present();
  }

  changePassword(){
    let changePasswordModal = this.modalCtrl.create("ModalChangePasswordPage", {"user_id" : this.user.user_id});

    changePasswordModal.onDidDismiss(data=>{
      console.log("change password dismiss");      
    });

    changePasswordModal.present();
  }

}
