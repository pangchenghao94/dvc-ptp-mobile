import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, normalizeURL } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@IonicPage()
@Component({
  selector: 'page-modal-floor-plan',
  templateUrl: 'modal-floor-plan.html',
})
export class ModalFloorPlanPage {

  constructor(private platform: Platform, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private screenOrientation: ScreenOrientation) {
  }

  ionViewDidLoad() {}

  ionViewDidEnter(){
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    var canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
    var context = canvas.getContext("2d");

    if(this.navParams.get("uri") != null){
      var img = new Image();
      
      var img_src = this.navParams.get("uri");
      if(this.platform.is("ios"))
        img.src = normalizeURL(img_src);
      else  
        img.src = img_src;

      img.onload = function() {
        context.drawImage(img, 0, 0);
      };    
    } 
    else{
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  saveDrawing() {
    var canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
    var dataURL = canvas.toDataURL("image/png");

    this.viewCtrl.dismiss(dataURL);
  }

  closeModal(){
    this.screenOrientation.unlock();
    this.viewCtrl.dismiss();
  }
}
