import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, Platform, AlertController, Alert, ModalController, normalizeURL } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransferObject, FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { GeneralProvider } from '../../../providers/general/general';
import { AuthProvider } from '../../../providers/auth/auth';
import { Exhibit } from '../../../models/exhibit';
import { ExhibitItem } from '../../../models/exhibit_item';
import { normalizeUrl } from 'ionic-angular/navigation/deep-linker';

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

      this.poDetailsForm = this.fb.group({
        exhibit_id: '',
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

  ionViewDidEnter() {
    if(this.navParams.get("exhibitData") != null){
      let exhibitData = this.navParams.get("exhibitData");

      this.exhibitItems = exhibitData.exhibitItems;      
      
      this.premiseLocationURI = exhibitData.exhibit.premise_location_URI == null ? exhibitData.exhibit.premise_location_path : exhibitData.exhibit.premise_location_URI;
      this.floorPlanURI = exhibitData.exhibit.floor_plan_URI == null ? exhibitData.exhibit.floor_plan_path : exhibitData.exhibit.floor_plan_URI;
      this.poDetailsForm.patchValue({
        exhibit_id: exhibitData.exhibit.exhibit_id,
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
      correctOrientation: true,

      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: this.camera.EncodingType.JPEG
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
      if (this.platform.is('android'))
        return this.file.dataDirectory + img;
      else{
        if (this.platform.is('android')) 
          return this.file.dataDirectory + img;
        else
          return normalizeURL(this.file.dataDirectory + img);
      }
    }
  }

  submit() {
    if(this.poDetailsForm.get('po_full_name').value == "" || this.poDetailsForm.get("po_ic_no").value == ""){
      this.general.displayConfirm("Warning", "The premise owner details are incomplete, confirm to save exhibit?", ()=>{
        this.saveExhibit();
      });
    }
    else{
      this.saveExhibit();
    }
  }

  saveExhibit(){
    let exhibit: Exhibit = new Exhibit();
    exhibit.exhibit_id            = this.poDetailsForm.get('exhibit_id').value;
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
  }

  addExhibitItem(){
    if(this.exhibitForm.get('img').value == null){
      this.general.displayAlert("Error!","it's null");
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
    let premiseLocationModal = this.modalCtrl.create("ModalPremiseLocationPage", {"uri": this.premiseLocationURI}, { cssClass: "modal-fullscreen" });
    premiseLocationModal.onDidDismiss(data=>{
      if(data != null)
        this.premiseLocationURI = data;
    });

    premiseLocationModal.present();
  }

  openDrawFloorPlanModal(){
    let floorPlanModal = this.modalCtrl.create("ModalFloorPlanPage", {"uri": this.floorPlanURI}, { cssClass: "modal-fullscreen" });
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
