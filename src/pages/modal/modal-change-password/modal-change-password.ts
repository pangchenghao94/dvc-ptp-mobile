import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { GeneralProvider } from '../../../providers/general/general';
import { AuthProvider } from '../../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-modal-change-password',
  templateUrl: 'modal-change-password.html',
})

export class ModalChangePasswordPage {
  changePassForm: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private fb: FormBuilder, 
    private general: GeneralProvider, private auth: AuthProvider) {

    this.changePassForm = this.fb.group({
      oldPass: ['', Validators.required],
      passwordGrp: this.fb.group({
        newPass: ['', [Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,25}$")]],
        newPassRepeat: ['', [Validators.required]]
      }, { validator: this.checkPasswordEqual })
    });

  }

  checkPasswordEqual(c: AbstractControl): {[key: string]: boolean} | null{
    let password = c.get('newPass');
    let repeatPassword = c.get('newPassRepeat');
    
    if(password.pristine || repeatPassword.pristine)
        return null;

    if(password.value === repeatPassword.value){
        return null;
    }
    return { 'match' : true };
  }

  ionViewDidLoad() {

  }

  submit(){
    // let passwordData: any = {
    //   "oldPass"       : this.changePassForm.get('oldPass').value,
    //   "newPassRepeat" : this.changePassForm.get('passwordGrp.newPassRepeat').value
    // };

    // let data: any = {   "token"     : this.general.getToken(),
    //                     "user_id"   : this.general.getUserID(),
    //                     "data"      : passwordData};
    
    this.general.getAuthObject().then((val)=>{
      val["data"] = {
        "oldPass"       : this.changePassForm.get('oldPass').value,
        "newPassRepeat" : this.changePassForm.get('passwordGrp.newPassRepeat').value
      };

      this.auth.postData(val, "api/user/changePassword").then((result) => {
        let responseData: any = result
  
        if(responseData.status == "0"){
          this.general.displayUnauthorizedAccessAlert(responseData.message);
          this.viewCtrl.dismiss();                 
        }
        else if(responseData.status == "2"){
          this.general.displayAlert("Wrong Old Password", responseData.message);
        }
        else{
          if(responseData.error){
            this.general.displayUnexpectedError(responseData.error.text);            
            console.log(responseData.error.text);
          }
          else{
            this.general.displayAlert("Note","Password has been updated successfully");
            this.changePassForm.reset();
            this.viewCtrl.dismiss();       
          }
        }
      },
      (err) => {
        this.general.displayAPIErrorAlert();
        this.viewCtrl.dismiss();      
        console.log("API error: " + err);
      });
    })
    .catch((err)=>{
      this.general.displayUnexpectedError(err);
      console.log(err);
    });
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

}
