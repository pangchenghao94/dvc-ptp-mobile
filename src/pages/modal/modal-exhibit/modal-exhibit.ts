import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, Platform, AlertController, Alert } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransferObject, FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { GeneralProvider } from '../../../providers/general/general';
import { AuthProvider } from '../../../providers/auth/auth';
import { Exhibit } from '../../../models/exhibit';

/**
 * Generated class for the ModalExhibitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-modal-exhibit',
  templateUrl: 'modal-exhibit.html',
})
export class ModalExhibitPage {
  exhibitForm: any;
  poDetailsForm: any;
  exhibitItems: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,  private fb: FormBuilder,
    private camera: Camera, private transfer: FileTransfer, private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController,
    private platform: Platform, private filePath: FilePath, private general: GeneralProvider, private file: File, private auth: AuthProvider) {
  
      this.poDetailsForm = this.fb.group({
        po_full_name: '',
        po_ic_no: ['', [Validators.pattern("^[0-9]{12,12}$")]],
        acceptance: 'true'
      });
  
      this.exhibitForm = this.fb.group({
        type: ['', Validators.required],
        code: ['', Validators.required],
        img: ['', Validators.required]
      });
  }

  ionViewDidLoad() {}
  
  openCamera(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(sourceType){
    let camera_opts = {
      quality: 90,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(camera_opts).then((imagePath) => {
      
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } 
      
      else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, 
    
    (err) => {
      this.general.displayToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.exhibitForm.patchValue({img: newFileName});
    }, error => {
      this.general.displayToast('Error while storing file.');
    });
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }

  public saveExhibit() {
    this.general.getAuthObject().then((val)=>{

      let exhibit = new Exhibit;
      exhibit.po_full_name  = this.poDetailsForm.get('po_full_name').value;
      exhibit.po_ic_no      = this.poDetailsForm.get('po_ic_no').value;
      exhibit.acceptance    = this.poDetailsForm.get('acceptance').value == "true" ? "1" : "0" ;
      
      val.data = exhibit;
      console.log(val);
      this.auth.postData(val, "api/exhibit/add").then((result) => {
        let responseData: any = result;
                    
        if(responseData.status == "0"){
          this.general.displayUnauthorizedAccessAlert(responseData.message);
        }
        else{
          if(responseData.error) {
            this.general.displayUnexpectedError(responseData.error.text);
          }

          else{
            // Destination URL
            var url = this.auth.getApiURL() + "api/upload";

            this.exhibitItems.forEach(element => {
              // File for Upload
              var targetPath = this.pathForImage(this.exhibitForm.get('img').value);
              // File name only
              var filename = this.exhibitForm.get('img').value;
            
              var options : FileUploadOptions = {
                fileKey: "file",
                fileName: filename,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params : {'fileName': filename }
              };
            
              const fileTransfer: FileTransferObject = this.transfer.create();
            
              let loading = this.general.displayLoading('Uploading...'); 
            
              // Use the FileTransfer to upload the image
              fileTransfer.upload(targetPath, url, options).then(data => {
                console.log(data);
                loading.dismissAll();
                this.general.displayToast('Image successful uploaded.');
              }, 
              err => {
                debugger;
                console.log(err);
                loading.dismissAll();
                this.general.displayToast('Error while uploading file.');
                this.general.displayAlert("sdf", JSON.stringify(err));
              });
            });
          }
        }
      }, 
      (err) =>{
        this.general.displayAPIErrorAlert();
      });

    })
    .catch((err) => {
        this.general.displayUnexpectedError(err);
      }
    );
  }

  uploadExhibitItems(exhibit_id){

  }

  addExhibitItem(){
    if(this.exhibitForm.get('img').value == null){
      this.general.displayAlert("dlskfjsldkf","it's null");
    }
    else{
      let exhibit: any = {
        fileName: this.exhibitForm.get('img').value,
        type    : this.exhibitForm.get('type').value,
        code    : this.exhibitForm.get('code').value
      };
      this.exhibitItems.push(exhibit);
      this.exhibitForm.reset();
    } 
  }

  deleteItem(fileName: string){
    this.general.displayConfirm("Delete", "Confirm to remove this exhibit item?", ()=>{
      this.exhibitItems = this.exhibitItems.filter(item => item.fileName != fileName);
    });
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }
}