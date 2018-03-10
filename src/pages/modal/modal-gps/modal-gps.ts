import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions
  //CameraPosition,
  //MarkerOptions,
  //Marker
 } from '@ionic-native/google-maps';

/**
 * Generated class for the ModalGpsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-gps',
  templateUrl: 'modal-gps.html',
})
export class ModalGpsPage {
  coordinates: any = this.navParams.get('data');
  map: GoogleMap;

  @ViewChild('mapCanvas') mapCanvas: ElementRef;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    console.log(this.coordinates);
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  closeModal(){
    this.viewCtrl.dismiss("sdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsf");
  }

  loadMap() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create(this.mapCanvas.nativeElement, mapOptions);

    //Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: 43.0741904,
              lng: -89.3809802
            }
          })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });

      });
    
  }
}
