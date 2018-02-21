import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { HomePage } from '../home/home';
import { AuthProvider } from '../../providers/auth/auth'
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: any;
  showWrongPassword: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private auth: AuthProvider, private storage: Storage) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(){
    let userData = {"username"  : this.loginForm.get('username').value, 
                    "password"  : this.loginForm.get('password').value};

    this.auth.postData(userData, "api/login").then((result) => {
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
          this.storage.set('userData', JSON.stringify(responseData.data)); 
          this.storage.set('isLoggedin', 'true');
          
          this.navCtrl.push(HomePage);
          this.navCtrl.setRoot(HomePage);
        }
      }
    }, 
    (err) =>{
      console.log("API error: " + err);
    });
  }

}
