import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Loading } from 'ionic-angular';
import { GeneralProvider } from '../../../providers/general/general';
import { AuthProvider } from '../../../providers/auth/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../models/user';

/**
 * Generated class for the ModalUpdateUserDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-update-user-details',
  templateUrl: 'modal-update-user-details.html',
})
export class ModalUpdateUserDetailsPage {
  authObj: any;
  userForm: any;
  loading: any;
  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private general: GeneralProvider, private auth: AuthProvider, private fb: FormBuilder) {
    this.general.getAuthObject().then((val) => {
      this.authObj = val;
    }).catch((err) => {
      this.general.displayUnexpectedError(JSON.stringify(err));
    });

    this.userForm = this.fb.group({
      id: '',
      gender: ['', Validators.required],
      phone_no: ['', [Validators.required, Validators.pattern("^[0-9]{10,12}$")]],
      email: ['', [Validators.required, Validators.email]],
      full_name: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ionViewDidLoad() {
    this.user = this.navParams.get("user");
    this.userForm.patchValue({
      id: this.user.user_id,
      gender: this.user.gender,
      phone_no: this.user.phone_no,
      email: this.user.email,
      full_name: this.user.full_name
    });
  }

  updateUser(){
    let postData: any = this.authObj;
    postData.full_name = this.userForm.get('full_name').value;
    postData.phone_no = this.userForm.get('phone_no').value;
    postData.email = this.userForm.get('email').value;
    postData.gender = this.userForm.get('gender').value;

    this.loading = this.general.displayLoading("Loading...")
    this.auth.postData(postData, "api/user/mobileUpdate/" + this.userForm.get('id').value).then((result) => {
      let responseData: any = result;

      if (responseData.error) {
        console.log(responseData.error);
      }
      else {
        this.general.displayToast("Successfully updated user info.");
        this.viewCtrl.dismiss();
      }
      this.loading.dismiss();      
    },
    (err) => {
      this.loading.dismiss();
      console.log("API error: " + err);
    });

  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

}
