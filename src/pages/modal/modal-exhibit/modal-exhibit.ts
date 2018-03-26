import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, Platform, AlertController, Alert, ModalController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransferObject, FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { GeneralProvider } from '../../../providers/general/general';
import { AuthProvider } from '../../../providers/auth/auth';
import { Exhibit } from '../../../models/exhibit';
import { ExhibitItem } from '../../../models/exhibit_item';

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
  authObj: any;
  exhibitForm: any;
  poDetailsForm: any;
  exhibitItems: any = [];
  premiseLocationURI: any;
  floorPlanURI: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,  private fb: FormBuilder,
    private camera: Camera, private transfer: FileTransfer, private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController,
    private platform: Platform, private filePath: FilePath, private general: GeneralProvider, private file: File, private auth: AuthProvider,
    private modalCtrl: ModalController) {
      
      // this.general.getAuthObject().then((val)=>{
      //   this.authObj = val;
      // }).catch((err) => {
      //   this.general.displayUnexpectedError(JSON.stringify(err));
      // });

      this.poDetailsForm = this.fb.group({
        po_full_name: '',
        po_ic_no: ['', [Validators.pattern("^[0-9]{12,12}$")]],
        acceptance: true
      });
  
      this.exhibitForm = this.fb.group({
        type: ['', Validators.required],
        code: ['', Validators.required],
        img: ['', Validators.required]
      });
  }

  ionViewDidLoad() {}

  ionViewDidEnter(){
    if(this.navParams.get("exhibitData") != null){
      let exhibitData = this.navParams.get("exhibitData");

      this.exhibitItems = exhibitData.exhibitItems;      
      this.premiseLocationURI = exhibitData.exhibit.premise_location_URI;
      this.floorPlanURI = exhibitData.exhibit.floor_plan_URI;
      this.poDetailsForm.patchValue({
        po_full_name: exhibitData.exhibit.po_full_name,
        po_ic_no: exhibitData.exhibit.po_ic_no,
        acceptance: exhibitData.exhibit.acceptance
      });
    }
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
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }

  saveExhibit() {
    if(this.poDetailsForm.get('po_full_name').value == "" || this.poDetailsForm.get("po_ic_no").value == ""){
      this.general.displayConfirm("Warning", "The premise owner details are incomplete, confirm to save exhibit?", ()=>{
        this.uploadExhibit();
      });
    }
    else{
      this.uploadExhibit();
    }
  }

  uploadExhibit(){
    let exhibit: Exhibit = new Exhibit();
    exhibit.po_full_name          = this.poDetailsForm.get('po_full_name').value;
    exhibit.po_ic_no              = this.poDetailsForm.get('po_ic_no').value;
    exhibit.acceptance            = this.poDetailsForm.get('acceptance').value;
    exhibit.floor_plan_URI        = this.floorPlanURI;
    exhibit.premise_location_URI  = this.premiseLocationURI;

    let dismissData: any = {
      exhibit: exhibit,
      exhibitItems: this.exhibitItems
    };

    this.viewCtrl.dismiss(dismissData);

    // let loading = this.general.displayLoading('Saving Exhibit...');

    // let exhibit = new Exhibit;
    // exhibit.po_full_name = this.poDetailsForm.get('po_full_name').value;
    // exhibit.po_ic_no = this.poDetailsForm.get('po_ic_no').value;
    // exhibit.acceptance = this.poDetailsForm.get('acceptance').value == "true" ? "1" : "0";

    // let postData = JSON.parse(JSON.stringify(this.authObj));
    // postData.data = exhibit;

    // this.auth.postData(postData, "api/exhibit/add").then((result) => {
    //   let responseData: any = result;

    //   if (responseData.status == "0") {
    //     this.general.displayUnauthorizedAccessAlert(responseData.message);
    //     loading.dismiss();
    //   }
    //   else {
    //     if (responseData.error) {
    //       this.general.displayUnexpectedError(responseData.error.text);
    //       loading.dismiss();
    //     }

    //     else {
    //       //********************************UPLOAD PREMISE LOCATION******************************************/
    //       let url1 = this.auth.getApiURL() + "api/upload/premise_location_drawing";
          
    //       // File for Upload and file name
    //       let targetPath1 = this.premiseLocationURI;
    //       let filename1 = "premise_location_drawing.png";
          
    //       //params
    //       let uploadParam1 = JSON.parse(JSON.stringify(this.authObj));
    //       uploadParam1.exhibit_id = responseData.data.id;

    //       var options1: FileUploadOptions = {
    //         fileKey: "file",
    //         fileName: filename1,
    //         chunkedMode: false,
    //         mimeType: "multipart/form-data",
    //         params: uploadParam1
    //       };

    //       const fileTransfer1: FileTransferObject = this.transfer.create();
    //       // Use the FileTransfer to upload the image
    //       fileTransfer1.upload(targetPath1, url1, options1).then(data => {},
    //         err => {
    //           this.general.displayUnexpectedError(JSON.stringify(err));
    //           loading.dismiss();
    //         });
    //       //********************************EOF PREMISE LOCATION******************************************/


    //       //********************************UPLOAD FLOOR PLAN******************************************/
    //       let url2 = this.auth.getApiURL() + "api/upload/floor_plan_drawing";
          
    //       // File for Upload and file name
    //       let targetPath2 = this.floorPlanURI;
    //       let filename2 = "floor_plan_drawing.png";
          
    //       //params
    //       let uploadParam2 = JSON.parse(JSON.stringify(this.authObj));
    //       uploadParam2.exhibit_id = responseData.data.id;

    //       var options2: FileUploadOptions = {
    //         fileKey: "file",
    //         fileName: filename2,
    //         chunkedMode: false,
    //         mimeType: "multipart/form-data",
    //         params: uploadParam2
    //       };

    //       const fileTransfer2: FileTransferObject = this.transfer.create();
    //       // Use the FileTransfer to upload the image
    //       fileTransfer2.upload(targetPath2, url2, options2).then(data => {},
    //         err => {
    //           this.general.displayUnexpectedError(JSON.stringify(err));
    //           loading.dismiss();
    //         });
    //       //********************************EOF UPLOAD FLOOR PLAN******************************************/


    //       //********************************START UPLOAD EXHIBIT ITEMS******************************************/
    //       //Destination URL
    //       let url3 = this.auth.getApiURL() + "api/upload/exhibit_item";

    //       let counter = 0;
    //       this.exhibitItems.forEach(item => {
    //         // File for Upload and File name only
    //         let targetPath3 = this.pathForImage(item.fileName);
    //         let filename3 = item.fileName;

    //         let uploadParam3 = JSON.parse(JSON.stringify(this.authObj));
    //         uploadParam3.fileName = filename3;
    //         uploadParam3.exhibit_id = responseData.data.id;
    //         uploadParam3.code = item.code;
    //         uploadParam3.type = item.type;

    //         var options3: FileUploadOptions = {
    //           fileKey: "file",
    //           fileName: filename3,
    //           chunkedMode: false,
    //           mimeType: "multipart/form-data",
    //           params: uploadParam3
    //         };

    //         const fileTransfer: FileTransferObject = this.transfer.create();
    //         // Use the FileTransfer to upload the image
    //         fileTransfer.upload(targetPath3, url3, options3).then(data => {
    //           let responseData: any = data.response
    //           if(responseData.status == "1"){
    //             counter++;
    //             if (counter == this.exhibitItems.length) {
    //               loading.dismiss();                
    //               this.general.displayToast('Exhibit have been saved successfully');
    //               this.closeModal(responseData.data.id);
    //             }
    //           }
    //           else
    //             this.general.displayUnexpectedError(JSON.stringify(responseData));
    //             loading.dismiss();
    //         },
    //         err => {
    //           this.general.displayUnexpectedError(JSON.stringify(err));
    //           loading.dismiss();
    //         });
    //       });
    //     }
    //   }
    // },
    // (err) => {
    //   this.general.displayAPIErrorAlert();
    //   loading.dismiss();
    // });
  }

  addExhibitItem(){
    if(this.exhibitForm.get('img').value == null){
      this.general.displayAlert("dlskfjsldkf","it's null");
    }
    else{
      let exhibitItem: ExhibitItem = new ExhibitItem();
      
      exhibitItem.fileName = this.exhibitForm.get('img').value,
      exhibitItem.type     = this.exhibitForm.get('type').value,
      exhibitItem.code     = this.exhibitForm.get('code').value
      
      this.exhibitItems.push(exhibitItem);
      this.exhibitForm.reset();
    } 
  }

  deleteItem(fileName: string){
    this.general.displayConfirm("Delete", "Confirm to remove this exhibit item?", ()=>{
      this.exhibitItems = this.exhibitItems.filter(item => item.fileName != fileName);
    });
  }

  openPremiseLocationModal(){
    let premiseLocationModal = this.modalCtrl.create("ModalPremiseLocationPage", {"uri": this.premiseLocationURI});
    premiseLocationModal.onDidDismiss(data=>{
      if(data != null)
        this.premiseLocationURI = data;
    });

    premiseLocationModal.present();
  }

  openDrawFloorPlanModal(){
    let floorPlanModal = this.modalCtrl.create("ModalFloorPlanPage", {"uri": this.floorPlanURI});
    floorPlanModal.onDidDismiss(data=>{
      if(data != null)
        this.floorPlanURI = data;
    });

    floorPlanModal.present();
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }
}
