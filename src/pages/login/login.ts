import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth'
import { Storage } from '@ionic/storage';
import { GeneralProvider } from '../../providers/general/general';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: any;
  showWrongPassword: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private auth: AuthProvider, private storage: Storage, 
    private general: GeneralProvider) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  login(){
    let loading = this.general.displayLoading("Please wait...");
  
    loading.present();

    let userData = {"username"  : this.loginForm.get('username').value, 
                    "password"  : this.loginForm.get('password').value};

    this.auth.postData(userData, "api/mobileLogin").then((result) => {
      let responseData:any = result;

      if(responseData.status == "2") {
        this.showWrongPassword = true;
      }
      else if(responseData.status == "3"){
        console.log(responseData.message);
      }
      else{
        if(responseData.data.state == 0) //user deactivated 
          this.showWrongPassword = true;

        else{
          this.storage.set('userData', responseData.data); 
          this.storage.set('isLoggedin', 'true');
          
          this.navCtrl.setRoot("HomePage");
        }
      }
      loading.dismiss();
    }, 
    (err) =>{
      loading.dismiss();
      this.general.displayAlert("Server Error", "Please contact administration");
      console.log("API error: " + err);
    });
  }

}
