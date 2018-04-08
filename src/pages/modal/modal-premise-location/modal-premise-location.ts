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
    var canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
    var context = canvas.getContext("2d");

    if(this.navParams.get("uri") != null){
      var img = new Image();
      img.src = this.navParams.get("uri");
      img.onload = function() {
        context.drawImage(img, 0, 0);
      };  
    }  
    else{
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
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
