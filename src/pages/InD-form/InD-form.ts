import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Loading, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { GeneralProvider } from '../../providers/general/general';
import { AuthProvider } from '../../providers/auth/auth';
import { InD } from '../../models/ind';
import { Exhibit } from '../../models/exhibit';
import { Sek5 } from '../../models/sek5';
import { FileTransferObject, FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

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
    private general: GeneralProvider, private auth: AuthProvider, private fileTransfer: FileTransfer, private file: File, private platform: Platform) {      
      this.general.getAuthObject().then((val) => {
        this.authObj = val;
      }).catch((err) => {
        this.general.displayUnexpectedError(JSON.stringify(err));
      });

      this.InDForm = this.fb.group({ 
        ind_id: '',
        assignment_id: '',
        area_inspection: false,
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
        abating_amount: '',
        abating_measure_type: '0',        
        act_destroy: '',
        act_education: false,
        act_pamphlet: false,
        coor_lat: '',
        coor_lng: ''
      });
  }

  ionViewDidEnter() {
    this.mode = this.navParams.get('mode');
    
    if(this.navParams.get('mode') == 0){
      this.InDForm.patchValue({assignment_id: this.navParams.get('assignment_id')});      
    }

    else if(this.navParams.get('mode') == 1){
      this.InDForm.patchValue({ind_id: this.navParams.get('ind_id')});
      this.getInd(this.navParams.get('ind_id'));      
    }

    else{
      this.general.displayUnexpectedError("Invalid Page!");
      this.navCtrl.setRoot("HomePage");      
    }
  }

  getInd(ind_id){
    let postData = JSON.parse(JSON.stringify(this.authObj));
    this.loading = this.general.displayLoading("Loading...");

    const promisesArray: any[] = [];    

    this.auth.postData(postData, "api/ind/get/" + this.InDForm.get("ind_id").value).then(async (result) => {
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
          let ind_data = responseData.ind;
          this.InDForm.patchValue({
            assignment_id: ind_data.assignment_id,
            area_inspection: this.general.convertIntToBool(ind_data.area_inspection),
            p_cooperation: this.general.convertIntToBool(ind_data.p_cooperation),
            p_close: this.general.convertIntToBool(ind_data.p_close),
            p_empty: this.general.convertIntToBool(ind_data.p_empty),
            p_shortAddr: ind_data.p_shortAddr,
            po_name: ind_data.po_name,
            po_id: ind_data.po_id,
            no_familyMember: ind_data.no_familyMember,
            no_fever: ind_data.no_fever,
            no_out_breeding: ind_data.no_out_breeding,
            no_in_breeding: ind_data.no_in_breeding,
            container_type: ind_data.container_type,
            no_pot_out_breeding: ind_data.no_pot_out_breeding,
            no_pot_in_breeding: ind_data.no_pot_in_breeding,
            abating_amount: ind_data.abating_amount,
            abating_measure_type: ind_data.abating_measure_type,
            act_destroy: ind_data.act_destroy,
            act_education: this.general.convertIntToBool(ind_data.act_education),
            act_pamphlet: this.general.convertIntToBool(ind_data.act_pamphlet),
            coor_lat: ind_data.coor_lat,
            coor_lng: ind_data.coor_lng
          });

          this.positionData = {
            lat : ind_data.coor_lat,
            lng : ind_data.coor_lng
          };
          
          if(responseData.sek8){
            this.sek8Data = responseData.sek8;
            this.sek8Data.chkbx1 = this.general.convertIntToBool(this.sek8Data.chkbx1);
            this.sek8Data.chkbx2 = this.general.convertIntToBool(this.sek8Data.chkbx2);
            this.sek8Data.chkbx3 = this.general.convertIntToBool(this.sek8Data.chkbx3);
            this.sek8Data.chkbx4 = this.general.convertIntToBool(this.sek8Data.chkbx4);
            this.sek8Data.chkbx5 = this.general.convertIntToBool(this.sek8Data.chkbx5);
            this.sek8Data.chkbx6 = this.general.convertIntToBool(this.sek8Data.chkbx6);
            this.sek8Data.chkbx7 = this.general.convertIntToBool(this.sek8Data.chkbx7);
            this.sek8Data.chkbx8 = this.general.convertIntToBool(this.sek8Data.chkbx8);
            this.sek8Data.chkbx9 = this.general.convertIntToBool(this.sek8Data.chkbx9);
            this.sek8Data.chkbx10 = this.general.convertIntToBool(this.sek8Data.chkbx10);
            this.sek8Data.chkbx11 = this.general.convertIntToBool(this.sek8Data.chkbx11);
            this.sek8Data.chkbx12 = this.general.convertIntToBool(this.sek8Data.chkbx12);
            this.sek8Data.chkbx13 = this.general.convertIntToBool(this.sek8Data.chkbx13);
          }
          
          if(responseData.sek5){
            let temp_dt = responseData.sek5.appointment_date;
            let arr_dt = temp_dt.split(' ');
          
            this.sek5Data = {
              date : arr_dt[0],
              time : arr_dt[1],
              remark : responseData.sek5.remark
            };
          }
          
          if(responseData.exhibit.exhibit_id){            
            this.exhibitData = {};
            this.exhibitData.exhibit = responseData.exhibit;
            this.exhibitData.exhibit.acceptance = this.general.convertIntToBool(this.exhibitData.exhibit.acceptance);

            this.exhibitData.exhibitItems = responseData.exhibitItems;

            let dl_premiseLocationURL = this.auth.getApiURL() + "api/download/premise_location_drawing"; 
            
            let postData = JSON.parse(JSON.stringify(this.authObj));
            postData.data = {
              exhibit_id             : this.exhibitData.exhibit.exhibit_id,
              premise_location_path  : this.exhibitData.exhibit.premise_location_path,
              floor_plan_path        : this.exhibitData.exhibit.floor_plan_path
            }

            await this.auth.postData(postData, "api/getDrawingsURL").then(async (result) => {
              let responseData: any = result;
              if(responseData.status == "1"){
                const ft: FileTransferObject = this.fileTransfer.create();

                let s3_premiseLocation = this.file.dataDirectory + this.exhibitData.exhibit.premise_location_path;                                   
                promisesArray.push(
                  ft.download(responseData.premise_location, s3_premiseLocation).then((entry) => {
                    this.exhibitData.exhibit.premise_location_URI = entry.toURL();
                  }, (error) => {
                    this.general.displayUnexpectedError(JSON.stringify(error));        
                    console.log(error);
                  })
                );

                let s3_floorPlan = this.file.dataDirectory + this.exhibitData.exhibit.floor_plan_path;                                                   
                promisesArray.push(
                  ft.download(responseData.floor_plan, s3_floorPlan).then((entry) => {
                    this.exhibitData.exhibit.floor_plan_URI = entry.toURL();
                  }, (error) => {
                    this.general.displayUnexpectedError(JSON.stringify(error));    
                    console.log(error);
                  })
                );
              }
            },(err) => {
              console.log(JSON.stringify(err));
              this.general.displayUnexpectedError(err);
            });

            for(let i = 0; i < this.exhibitData.exhibitItems.length; i++){
            // await this.exhibitData.exhibitItems.forEach(async item => {
              let item = this.exhibitData.exhibitItems[i];
              let postData = JSON.parse(JSON.stringify(this.authObj));
              postData.data = {
                exhibit_id: this.exhibitData.exhibit.exhibit_id,
                s3_path   : item.s3_path
              }
              
              await this.auth.postData(postData, "api/getExhibitItemURL").then(async (result) => {
                let responseData: any = result;
                if(responseData.status == "1"){
                  const ft: FileTransferObject = this.fileTransfer.create();
  
                  let storageLocation = this.file.dataDirectory + item.s3_path;     
                  promisesArray.push(ft.download(responseData.s3_path, storageLocation).then((entry) => {
                    console.log("item done");
                    item.fileName = item.s3_path;
                  }, (error) => {
                    this.general.displayUnexpectedError(error);
                    console.log(JSON.stringify(error));
                  }));
                }
              },(err) => {
                console.log(JSON.stringify(err));
                this.general.displayUnexpectedError(err);
              });
            };
          }

          if(promisesArray.length != 0){
            await Promise.all(promisesArray)
              .then((res) => {
                this.loading.dismiss();
              }, 
              (firstErr) => {
                this.loading.dismiss();
                this.navCtrl.setRoot("InDListPage");
                this.general.displayUnexpectedError(firstErr);
                console.error("Error loading I&D.", firstErr);
              });
          }
          else{
            this.loading.dismiss();
          }
        }
      }
    },
    (err) => {
      console.log(JSON.stringify(err));
      this.loading.dismiss();      
      this.general.displayAPIErrorAlert();
    });
  }

  openGPSModal(){
    let gpsModal = this.modalCtrl.create("ModalGpsPage", {"positionData" : this.positionData}, { cssClass: "modal-fullscreen white-backdrop" });
    gpsModal.onDidDismiss(data=>{
      console.log(data);
      this.isModal = false;
      this.positionData = data;
      this.InDForm.patchValue({
        p_shortAddr : this.positionData.location,
        coor_lat    : this.positionData.lat,
        coor_lng    : this.positionData.lng
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
    if(this.mode == 0){
      this.general.displayConfirm("Cancel Confirmation", "Confirm to cancel adding this I&D form?", ()=>{
        this.navCtrl.setRoot("HomePage");
      });
    }
    else if(this.mode == 1){
      this.general.displayConfirm("Cancel Confirmation", "Confirm to cancel editing this I&D form?", ()=>{
        this.navCtrl.setRoot("InDListPage");
      });
    }
    else{
      this.navCtrl.setRoot("HomePage");  
    }
  }

  submit(){
    if(this.mode == 0){
      this.addInD();
    }
    else if(this.mode == 1){
      this.editInD();
    }
  }

  confirmationMessage(message: string): string{
    if((parseInt(this.InDForm.get("no_out_breeding").value) > 0 || parseInt(this.InDForm.get("no_in_breeding").value) > 0) && this.exhibitData == null)
      message += " - The number of inside/outside breeding is more than 0 but you have not input the Exhibit information. <br/>"
    if((parseInt(this.InDForm.get("no_pot_out_breeding").value) > 0 || parseInt(this.InDForm.get("no_pot_in_breeding").value) > 0) && this.sek8Data == null)
      message += " - The number of potential inside/outside breeding is more than 0 but you have not input the Seksyen 8 information. <br/>"
    if(this.InDForm.get("p_close").value == true && this.sek5Data == null)
      message += " - The premise is closed but you have not input the Seksyen 5 information. <br/>"

    return message;
  }

  addInD(){
    let message: string = "<strong>Confirm to save I&D?</strong> <br/>";
    message = this.confirmationMessage(message);

    this.general.displayConfirm("Confirmation", message, ()=>{
      this.loading = this.general.displayLoading("Saving I&D...");

      let postData = JSON.parse(JSON.stringify(this.authObj));      
      postData.data = this.getInDFormData();      

      if(this.exhibitData != null)
        postData.exhibitData = this.getExhibitData();
      if(this.sek5Data != null)
        postData.sek5Data = this.getSek5Data();
      if(this.sek8Data != null)
        postData.sek8Data = this.sek8Data;

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
            if(this.exhibitData != null){
              let exhibit_id = responseData.exhibit.id;
              const promisesArray: any[] = [];

              promisesArray.push(
                this.uploadFloorPlan(exhibit_id, this.exhibitData.exhibit.floor_plan_URI)
              );

              promisesArray.push(
                this.uploadPremiseLocation(exhibit_id, this.exhibitData.exhibit.premise_location_URI)
              );
              
              //upload exhibitItems
              this.exhibitData.exhibitItems.forEach(item => {
                promisesArray.push(
                  this.uploadExhibititem(exhibit_id, item)
                );
              });

              // //upload floor plan png
              // let uploadFloorPlanURL = this.auth.getApiURL() + "api/upload/floor_plan_drawing";            
              // let floorPlanParam = JSON.parse(JSON.stringify(this.authObj));
              // floorPlanParam.exhibit_id = responseData.exhibit.id;
              // let floorPlanPath = this.exhibitData.exhibit.floor_plan_URI;            

              // var uploadFloorPlanOptions: FileUploadOptions = {
              //   fileKey: "file",
              //   fileName: "floorplan.png",
              //   chunkedMode: false,
              //   mimeType: "multipart/form-data",
              //   params: floorPlanParam
              // };

              // const fileTransfer2: FileTransferObject = this.fileTransfer.create();
              // // Use the FileTransfer to upload the image
              // promisesArray.push(
              //   fileTransfer2.upload(floorPlanPath, uploadFloorPlanURL, uploadFloorPlanOptions)
              //     .then(data => { }, err => {
              //       this.general.displayUnexpectedError(JSON.stringify(err));
              //       this.loading.dismiss();
              //     })
              // );

              // //upload premise location png
              // let uploadPremiseLocURL = this.auth.getApiURL() + "api/upload/premise_location_drawing";            
              // let premiseLocParam = JSON.parse(JSON.stringify(this.authObj));
              // premiseLocParam.exhibit_id = responseData.exhibit.id;
              // let premiseLocPath = this.exhibitData.exhibit.premise_location_URI;            

              // var uploadPremiseLocOptions: FileUploadOptions = {
              //   fileKey: "file",
              //   fileName: "premiseLoc.png",
              //   chunkedMode: false,
              //   mimeType: "multipart/form-data",
              //   params: premiseLocParam
              // };

              // const ftPremiseLoc: FileTransferObject = this.fileTransfer.create();
              // // Use the FileTransfer to upload the image
              // promisesArray.push(
              //   ftPremiseLoc.upload(premiseLocPath, uploadPremiseLocURL, uploadPremiseLocOptions)
              //     .then(data => { }, err => {
              //       this.general.displayUnexpectedError(JSON.stringify(err));
              //       this.loading.dismiss();
              //     })
              // );

              // //upload exhibitItems
              // let exhibitItemURL = this.auth.getApiURL() + "api/upload/exhibit_item";
              // this.exhibitData.exhibitItems.forEach(item => {
              //   // File for Upload and File name only
              //   let exhibitItemPath = this.general.getPathForImage(item.fileName);
              //   let filename = item.fileName;

              //   let exhibitItemParam = JSON.parse(JSON.stringify(this.authObj));
              //   exhibitItemParam.fileName = filename;
              //   exhibitItemParam.exhibit_id = responseData.exhibit.id;
              //   exhibitItemParam.code = item.code;
              //   exhibitItemParam.type = item.type;

              //   var uploadExhibitItemOptions: FileUploadOptions = {
              //     fileKey: "file",
              //     fileName: filename,
              //     chunkedMode: false,
              //     mimeType: "multipart/form-data",
              //     params: exhibitItemParam
              //   };

              //   const ftExhibitItem: FileTransferObject = this.fileTransfer.create();
              //   // Use the FileTransfer to upload the image
              //   ftExhibitItem.upload(exhibitItemPath, exhibitItemURL, uploadExhibitItemOptions).then(data => {
              //     let responseData: any = data.response
              //     console.log("upload ok");
              //     console.log(JSON.stringify(responseData));
              //   },
              //   err => {
              //     console.log("upload error");
              //     this.general.displayUnexpectedError(JSON.stringify(err));
              //     this.loading.dismiss();
              //   });
              // });

              await Promise.all(promisesArray)
              .then((res) => {
                this.general.displayToast("I&D has been added successfully");
                this.loading.dismiss();
                this.navCtrl.setRoot("HomePage");
              }, 
              (firstErr) => {
                this.loading.dismiss();
                this.general.displayUnexpectedError(firstErr);
                console.error("Error uploading file.", firstErr);
              });
            }
            else{
              this.general.displayToast("I&D has been added successfully");
              this.loading.dismiss();
              this.navCtrl.setRoot("HomePage");              
            }
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

  editInD(){
    let message: string = "<strong>Confirm to Edit I&D?</strong> <br/>";
    message = this.confirmationMessage(message);

    this.general.displayConfirm("Confirmation", message, ()=>{
      this.loading = this.general.displayLoading("Saving I&D...");

      let postData = JSON.parse(JSON.stringify(this.authObj));      
      postData.data = this.getInDFormData();      

      if(this.exhibitData != null)
        postData.exhibitData = this.getExhibitData();
      if(this.sek5Data != null)
        postData.sek5Data = this.getSek5Data();
      if(this.sek8Data != null)
        postData.sek8Data = this.sek8Data;
      
      this.auth.postData(postData, "api/ind/update").then(async (result) => {
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
            if(this.exhibitData != null){
              let exhibit_id = this.exhibitData.exhibit.exhibit_id;

              const promisesArray: any[] = [];

              promisesArray.push(
                this.uploadFloorPlan(exhibit_id, this.exhibitData.exhibit.floor_plan_URI)
              );

              promisesArray.push(
                this.uploadPremiseLocation(exhibit_id, this.exhibitData.exhibit.premise_location_URI)
              );
              
              //upload exhibitItems
              this.exhibitData.exhibitItems.forEach(item => {
                promisesArray.push(
                  this.uploadExhibititem(exhibit_id, item)
                );
              });

              await Promise.all(promisesArray)
              .then((res) => {
                this.general.displayToast("I&D has been edited successfully");
                this.loading.dismiss();
                this.navCtrl.setRoot("InDListPage");
              }, 
              (firstErr) => {
                this.loading.dismiss();
                this.general.displayUnexpectedError(JSON.stringify(firstErr));
                console.error("Error uploading file.", firstErr);
              });
            }
            else{
              this.general.displayToast("I&D has been edited successfully");
              this.loading.dismiss();
              this.navCtrl.setRoot("InDListPage");              
            }
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

  uploadFloorPlan(exhibit_id, floor_plan_URI){
    //upload floor plan png
    let url = this.auth.getApiURL() + "api/upload/floor_plan_drawing";            
    let param = JSON.parse(JSON.stringify(this.authObj));
    param.exhibit_id = exhibit_id;
    let uri = floor_plan_URI;            

    var opts: FileUploadOptions = {
      fileKey: "file",
      fileName: "floorplan.png",
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: param
    };

    const ft: FileTransferObject = this.fileTransfer.create();
    // Use the FileTransfer to upload the image

    return ft.upload(uri, url, opts)
      .then(data => { 
        let responseData: any = JSON.parse(data.response);
        if(responseData.status != "1")
          throw new Error("Fail to upload floor plan drawing.");
      }, 
      err => {
        this.general.displayUnexpectedError(JSON.stringify(err));
      });
  }

  uploadPremiseLocation(exhibit_id, premise_location_URI){
    //upload premise location png
    let url = this.auth.getApiURL() + "api/upload/premise_location_drawing";            
    let param = JSON.parse(JSON.stringify(this.authObj));
    param.exhibit_id = exhibit_id;
    let uri = premise_location_URI;            

    var opts: FileUploadOptions = {
      fileKey: "file",
      fileName: "premiseLoc.png",
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: param
    };

    const ft: FileTransferObject = this.fileTransfer.create();
    // Use the FileTransfer to upload the image
    return ft.upload(uri, url, opts)
      .then(data => { 
        let responseData: any = JSON.parse(data.response);
        if(responseData.status != "1")
          throw new Error("Fail to upload floor plan drawing.");
      }, 
      err => {
        this.general.displayUnexpectedError(JSON.stringify(err));
      });
  }

  uploadExhibititem(exhibit_id, item){
    // File for Upload and File name only
    let url = this.auth.getApiURL() + "api/upload/exhibit_item";                
    let uri = this.general.getPathForImage(item.fileName);
    let filename = item.fileName;

    let param = JSON.parse(JSON.stringify(this.authObj));
    param.fileName = filename;
    param.exhibit_id = exhibit_id;
    param.code = item.code;
    param.type = item.type;

    var opts: FileUploadOptions = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: param
    };

    const ft: FileTransferObject = this.fileTransfer.create();
    // Use the FileTransfer to upload the image
    return ft.upload(uri, url, opts).then(data => {
      let responseData: any = JSON.parse(data.response);
      if(responseData.status != "1")
        throw new Error("Fail to upload exhibit item.");
    },
    err => {
      this.general.displayUnexpectedError(JSON.stringify(err));
    });
  }

  getInDFormData(){
    let data: InD             = new InD();
    data.ind_id               = this.InDForm.get("ind_id").value;    
    data.assignment_id        = this.InDForm.get("assignment_id").value;
    data.area_inspection      = this.InDForm.get("area_inspection").value;
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
    data.abating_measure_type = this.InDForm.get("abating_measure_type").value;
    data.abating_amount       = this.InDForm.get("abating_amount").value;
    data.act_destroy          = this.InDForm.get("act_destroy").value;
    data.act_education        = this.InDForm.get("act_education").value;
    data.act_pamphlet         = this.InDForm.get("act_pamphlet").value;
    data.coor_lat             = this.InDForm.get("coor_lat").value;
    data.coor_lng             = this.InDForm.get("coor_lng").value;  

    return data;
  }

  getExhibitData(){
    let justExhibit: Exhibit  = new Exhibit();
    justExhibit.exhibit_id    = this.exhibitData.exhibit.exhibit_id;
    justExhibit.po_full_name  = this.exhibitData.exhibit.po_full_name;
    justExhibit.po_ic_no      = this.exhibitData.exhibit.po_ic_no;
    justExhibit.acceptance    = this.exhibitData.exhibit.acceptance;
    
    return justExhibit;
  }

  getSek5Data(){
    let sek5: Sek5 = new Sek5();
    let temp_sek5Data = this.general.convertToDate(this.sek5Data.date, this.sek5Data.time);
    sek5.appointment_date   = this.general.convertToSqlDatetimeStr(temp_sek5Data);
    sek5.remark = this.sek5Data.remark;
    return sek5;
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
