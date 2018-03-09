import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { GeneralProvider } from '../../providers/general/general';
import { Assignment } from '../../models/assignment';
import { InDListPage } from '../InD-list/InD-list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild('content') content: ElementRef;

  constructor(public navCtrl: NavController, private auth: AuthProvider, private general: GeneralProvider, 
    private alertCtrl: AlertController, private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    this.getAssignments();
  }

  ionViewCanEnter(){
    return this.auth.authenticate();
  }

  getAssignments(){
    let alert = this.alertCtrl.create({
      title: 'Server Error',
      subTitle: 'Please contact administration.',
      buttons: ['Dismiss']
    });

    this.general.getAuthObject().then((val)=>{
      this.auth.postData(val, "api/assignment/getPDKAssignmentList").then((result) => {
        let responseData:any = result;
        
        if(responseData.status == "0"){
          alert.setTitle("Unauthorized Access");
          alert.setSubTitle(responseData.message);
          alert.present();
        }
        
        else{
          this.generateAssignmentList(responseData.data);
        }
      }, 
      (err) =>{
        alert.setTitle("Server Error");
        alert.setSubTitle("Please contact administration. Error: API Error.")
        alert.present();
      });
    }).catch(error=>{ });
  }

  testing(){
    alert('success');
  }

  generateAssignmentList(assignments: any){
    if(assignments.length <= 0){
      const element = this.renderer.createElement('ion-label');
      const txt = this.renderer.createText('  You do not have assignment today.');

      const element2 = this.renderer.createElement('strong');
      const txt2 = this.renderer.createText('NOTE');

      this.renderer.addClass(element, 'padding-10');    
      this.renderer.addClass(element, 'alert');
      this.renderer.addClass(element, 'alert-info');

      this.renderer.appendChild(element2, txt2);            
      this.renderer.appendChild(element, element2);      
      this.renderer.appendChild(element, txt);
      this.renderer.appendChild(this.content.nativeElement, element);
    }
    else{
      assignments.forEach(assignment => {
        let element = this.renderer.createElement('div');
        
        this.renderer.listen(element, 'click', (evt)=>{
          this.assignmentClick(assignment.assignment_id);
        });
        
        var team = assignment.team;
        var postcode = assignment.postcode;
        var address = assignment.address;
        var createdBy = assignment.full_name;
  
        let template = `<ion-card class="card card-md">
                    <ion-card-content class="card-content card-content-md">
                      <ion-grid class="grid">
                        <ion-row class="row">
                          <ion-col class="col">
                            <strong>Team</strong>
                          </ion-col>
                          <ion-col class="col" col-8>${team}</ion-col>          
                        </ion-row>
                        <ion-row class="row">
                          <ion-col class="col">
                            <strong>Postcode</strong>
                          </ion-col>
                          <ion-col class="col" col-8>${postcode}</ion-col>          
                        </ion-row>
                        <ion-row class="row">
                          <ion-col class="col">
                            <strong>Address</strong>
                          </ion-col>
                          <ion-col class="col" col-8>${address}</ion-col>          
                        </ion-row>
                        <ion-row class="row">
                          <ion-col class="col">
                            <strong>Created by</strong>
                          </ion-col>
                          <ion-col class="col" col-8>${createdBy}</ion-col>          
                        </ion-row>
                      </ion-grid>  
                    </ion-card-content>
                  </ion-card>`;
  
        element.insertAdjacentHTML('afterbegin', template);
        this.renderer.appendChild(this.content.nativeElement, element);
      });
    }
  }

  assignmentClick(id: any){
    this.navCtrl.setRoot(InDListPage);
  }  
}
