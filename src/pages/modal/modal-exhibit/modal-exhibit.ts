import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, Platform } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransferObject, FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { GeneralProvider } from '../../../providers/general/general';

/**
 * Generated class for the ModalExhibitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-modal-exhibit',
  templateUrl: 'modal-exhibit.html',
})
export class ModalExhibitPage {
  exhibitForm: any;
  lastImage: string = null;

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: true
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,  private fb: FormBuilder,
    private camera: Camera, private transfer: FileTransfer, private actionSheetCtrl: ActionSheetController,
    private platform: Platform, private filePath: FilePath, private general: GeneralProvider, private file: File) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalExhibitPage');

    this.exhibitForm = this.fb.group({
      type: '',
      code: ''
    });
  }

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
      quality: 100,
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
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
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
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.general.displayToast('Error while storing file.');
    });
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL
    var url = "http://192.168.43.169/api/upload";
   
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
   
    // File name only
    var filename = this.lastImage;
   
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
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

}
