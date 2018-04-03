import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-floor-plan',
  templateUrl: 'modal-floor-plan.html',
})
export class ModalFloorPlanPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {}

  ionViewDidEnter(){
    if(this.navParams.get("uri") != null){
      var canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
      var context = canvas.getContext("2d");

      var img = new Image();
      img.src = this.navParams.get("uri");
      img.onload = function() {
        context.drawImage(img, 0, 0);
      };    
    } 
  }

  saveDrawing() {
    var canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
    var dataURL = canvas.toDataURL("image/png");

    this.viewCtrl.dismiss(dataURL);
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }
}
