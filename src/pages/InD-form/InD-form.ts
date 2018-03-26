import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Loading } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { GeneralProvider } from '../../providers/general/general';
import { AuthProvider } from '../../providers/auth/auth';
import { InD } from '../../models/ind';
import { Exhibit } from '../../models/exhibit';
import { Sek5 } from '../../models/sek5';
import { FileTransferObject, FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';

/**
 * Generated class for the InDFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-InD-form',
  templateUrl: 'InD-form.html',
})
export class InDFormPage {
  InDForm: any;
  positionData: any;
  isModal: boolean;
  mode: number; 
  exhibitData: any;
  sek8Data: any;
  sek5Data: any;
  authObj: any;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private modalCtrl: ModalController, 
    private general: GeneralProvider, private auth: AuthProvider, private fileTransfer: FileTransfer) {      

      this.general.getAuthObject().then((val) => {
        this.authObj = val;
      }).catch((err) => {
        this.general.displayUnexpectedError(JSON.stringify(err));
      });

      this.InDForm = this.fb.group({ 
        assignment_id: '',
        p_close: false,
        p_empty: false,
        p_cooperation: true,
        p_shortAddr: ['', Validators.required],      
        po_name: '',
        po_id: ['', [Validators.pattern("^[0-9]{12,12}$")]],
        no_familyMember: ['', Validators.min(0)],
        no_fever: ['', Validators.min(0)],
        no_out_breeding: ['', Validators.min(0)],
        no_in_breeding: ['', Validators.min(0)],
        container_type: '',
        no_pot_out_breeding: ['', Validators.min(0)],
        no_pot_in_breeding: ['', Validators.min(0)],
        act_abating: false,
        act_destroy: false,
        act_education: false,
        act_pamphlet: false,
        coor_lat: '',
        coor_lng: ''
      });
  }

  ionViewDidEnter() {
    this.InDForm.patchValue({assignment_id: this.navParams.get('id')});
    this.mode = this.navParams.get('mode');
  }

  openGPSModal(){
    let gpsModal = this.modalCtrl.create("ModalGpsPage", {"positionData" : this.positionData});
    gpsModal.onDidDismiss(data=>{
      this.isModal = false;
      this.positionData = data;
      this.InDForm.patchValue({
        p_shortAddr : this.positionData.location,
        coor_lat    : this.positionData.coordinates.lat,
        coor_lng    : this.positionData.coordinates.lng
      });
    });

    this.isModal = true;
    gpsModal.present();
  }

  openExhibitModal(){
    let exhibitModal = this.modalCtrl.create("ModalExhibitPage", {"exhibitData": this.exhibitData});
    exhibitModal.onDidDismiss(data=>{
      if(data != null)
        this.exhibitData = data;
    });

    exhibitModal.present();
  }

  openSek8Modal(){
    let sek8Modal = this.modalCtrl.create("ModalSek8Page", {"sek8Data": this.sek8Data});
    sek8Modal.onDidDismiss(data=>{
      if(data != null)
        this.sek8Data = data;
    });

    sek8Modal.present();
  }

  openSek5Modal(){
    let sek5Modal = this.modalCtrl.create("ModalSek5Page", {"sek5Data": this.sek5Data});
    sek5Modal.onDidDismiss(data=>{
      if(data != null)
        this.sek5Data = data;
    });

    sek5Modal.present();
  }

  cancelInd(){
    this.general.displayConfirm("Cancel Confirmation", "Confirm to cancel adding this I&D form?", ()=>{
      this.navCtrl.setRoot("HomePage");
    });
  }

  saveInD(){
    let message: string = "<strong>Confirm to save I&D?</strong> <br/>";

    if((parseInt(this.InDForm.get("no_out_breeding").value) > 0 || parseInt(this.InDForm.get("no_in_breeding").value) > 0) && this.exhibitData == null)
      message += " - The number of inside/outside breeding is more than 0 but you have not input the Exhibit information. <br/>"
    if((parseInt(this.InDForm.get("no_pot_out_breeding").value) > 0 || parseInt(this.InDForm.get("no_pot_in_breeding").value) > 0) && this.sek8Data == null)
      message += " - The number of potential inside/outside breeding is more than 0 but you have not input the Seksyen 8 information. <br/>"
    if(this.InDForm.get("p_close").value == true && this.sek5Data == null)
      message += " - The premise is closed but you have not input the Seksyen 5 information. <br/>"

    this.general.displayConfirm("Confirmation", message, ()=>{
      this.loading = this.general.displayLoading("Saving I&D...");

      let postData = JSON.parse(JSON.stringify(this.authObj));      

      let data: InD             = new InD();
      data.assignment_id        = this.InDForm.get("assignment_id").value;
      data.p_close              = this.InDForm.get("p_close").value;
      data.p_empty              = this.InDForm.get("p_empty").value;
      data.p_cooperation        = this.InDForm.get("p_cooperation").value;
      data.p_shortAddr          = this.InDForm.get("p_shortAddr").value;
      data.po_name              = this.InDForm.get("po_name").value;
      data.po_id                = this.InDForm.get("po_id").value;
      data.no_familyMember      = this.InDForm.get("no_familyMember").value;
      data.no_fever             = this.InDForm.get("no_fever").value;
      data.no_out_breeding      = this.InDForm.get("no_out_breeding").value;
      data.no_in_breeding       = this.InDForm.get("no_in_breeding").value;
      data.container_type       = this.InDForm.get("container_type").value;
      data.no_pot_out_breeding  = this.InDForm.get("no_pot_out_breeding").value;
      data.no_pot_in_breeding   = this.InDForm.get("no_pot_in_breeding").value;
      data.act_abating          = this.InDForm.get("act_abating").value;
      data.act_destroy          = this.InDForm.get("act_destroy").value;
      data.act_education        = this.InDForm.get("act_education").value;
      data.act_pamphlet         = this.InDForm.get("act_pamphlet").value;
      data.coor_lat             = this.InDForm.get("coor_lat").value;
      data.coor_lng             = this.InDForm.get("coor_lng").value;      
      
      postData.data = this.general.convertBoolToInt(data);      

      if(this.exhibitData != null){
        let justExhibit: Exhibit  = new Exhibit();
        justExhibit.po_full_name  = this.exhibitData.exhibit.po_full_name;
        justExhibit.po_ic_no      = this.exhibitData.exhibit.po_ic_no;
        justExhibit.acceptance    = this.exhibitData.exhibit.acceptance;

        postData.exhibitData = this.general.convertBoolToInt(justExhibit);
      }

      if(this.sek5Data != null){
        let sek5: Sek5 = new Sek5();

        let temp_sek5Data = this.general.convertToDate(this.sek5Data.date, this.sek5Data.time);
        sek5.appointment_date   = this.general.convertToSqlDatetimeStr(temp_sek5Data);
        sek5.remark = this.sek5Data.remark;
        
        postData.sek5Data = sek5;
      }

      if(this.sek8Data != null){
        postData.sek8Data = this.general.convertBoolToInt(this.sek8Data);
      }

      console.log(postData);
      
      this.auth.postData(postData, "api/ind/add").then(async (result) => {
        let responseData: any = result;

        if (responseData.status == "0") {
          this.general.displayUnauthorizedAccessAlert(responseData.message);
          this.loading.dismiss();
        }
        else {
          if (responseData.error) {
            this.general.displayUnexpectedError(responseData.error.text);
            this.loading.dismiss();
          }
          else {
            const promisesArray: any[] = [];

            //upload floor plan png
            let uploadFloorPlanURL = this.auth.getApiURL() + "api/upload/floor_plan_drawing";            
            let floorPlanParam = JSON.parse(JSON.stringify(this.authObj));
            floorPlanParam.exhibit_id = responseData.exhibit.id;
            let floorPlanPath = this.exhibitData.exhibit.floor_plan_URI;            

            var uploadFloorPlanOptions: FileUploadOptions = {
              fileKey: "file",
              fileName: "floorplan.png",
              chunkedMode: false,
              mimeType: "multipart/form-data",
              params: floorPlanParam
            };

            const fileTransfer2: FileTransferObject = this.fileTransfer.create();
            // Use the FileTransfer to upload the image
            promisesArray.push(
              fileTransfer2.upload(floorPlanPath, uploadFloorPlanURL, uploadFloorPlanOptions)
                .then(data => { }, err => {
                  this.general.displayUnexpectedError(JSON.stringify(err));
                  this.loading.dismiss();
                })
            );

            //upload floor plan png
            let uploadPremiseLocURL = this.auth.getApiURL() + "api/upload/premise_location_drawing";            
            let premiseLocParam = JSON.parse(JSON.stringify(this.authObj));
            premiseLocParam.exhibit_id = responseData.exhibit.id;
            let premiseLocPath = this.exhibitData.exhibit.premise_location_URI;            

            var uploadPremiseLocOptions: FileUploadOptions = {
              fileKey: "file",
              fileName: "premiseLoc.png",
              chunkedMode: false,
              mimeType: "multipart/form-data",
              params: premiseLocParam
            };

            const ftPremiseLoc: FileTransferObject = this.fileTransfer.create();
            // Use the FileTransfer to upload the image
            promisesArray.push(
              ftPremiseLoc.upload(premiseLocPath, uploadPremiseLocURL, uploadPremiseLocOptions)
                .then(data => { }, err => {
                  this.general.displayUnexpectedError(JSON.stringify(err));
                  this.loading.dismiss();
                })
            );

            await Promise.all(promisesArray)
            .then((res) => {
              this.loading.dismiss();
            }, 
            (firstErr) => {
              this.loading.dismiss();
              this.general.displayUnexpectedError(JSON.stringify(firstErr));
              console.error("Error uploading file.", firstErr);
            });
            this.loading.dismiss();
          }
        }
      },
      (err) => {
        console.log(JSON.stringify(err));
        this.general.displayAPIErrorAlert();
        this.loading.dismiss();
      });
    });
  }

  uploadFiles(){

  }

  testing(){
    debugger;
    console.log(this.InDForm);
  }

  toggleEmptyToClose(target: any){
    if(target.checked)
      this.InDForm.patchValue({
        p_close: false
      });
    else  
      this.InDForm.patchValue({
        p_empty: false
      });
  }

  toggleCloseToEmpty(target: any){
    if(target.checked)
      this.InDForm.patchValue({
        p_empty: false
      });
    else
      this.InDForm.patchValue({
        p_close: false
      })
  }
}
