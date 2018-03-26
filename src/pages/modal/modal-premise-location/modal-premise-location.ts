import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-premise-location',
  templateUrl: 'modal-premise-location.html',
})
export class ModalPremiseLocationPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

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

  ionViewDidLoad() {}

  saveDrawing() {
    var canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
    var dataURL = canvas.toDataURL("image/png");

    this.viewCtrl.dismiss(dataURL);
  }

  closeModal(exhibit_id?: any){
    this.viewCtrl.dismiss();
  }
}
