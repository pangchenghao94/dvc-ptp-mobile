import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  Marker
 } from '@ionic-native/google-maps';
import { GeneralProvider } from '../../../providers/general/general';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-modal-gps',
  templateUrl: 'modal-gps.html',
})
export class ModalGpsPage {
  coordinates: any = {};
  map: GoogleMap;
  debug: string;
  marker: Marker;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private platform: Platform, 
    private general: GeneralProvider, private geoLocation: Geolocation) {
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {

      if(this.navParams.get('coordinates') != null){
        let temp_coor = this.navParams.get('coordinates');
        this.coordinates.latitude = temp_coor.lat;
        this.coordinates.longitude = temp_coor.lng;

        this.loadMap();
      }
      else{
        this.geoLocation.getCurrentPosition().then((result) => {
          this.coordinates = result.coords;
          this.loadMap();
         })
         .catch((error) => {
           this.general.displayAlert('Fail to get location', error);
         });
      }
      
    });
  }

  closeModal(){
    this.viewCtrl.dismiss(this.marker.getPosition());
  }

  loadMap() {
    let mapElement = document.getElementById('mapCanvas');
    
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.coordinates.latitude,
          lng: this.coordinates.longitude
        },
        zoom: 18,
        tilt: 30
      }
    };
    this.map = GoogleMaps.create(mapElement, mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.map.setMyLocationEnabled(true);

        // this.map.getMyLocation().then((myLocation: MyLocation) => {
        //   console.log(myLocation);
        // });

        this.map.addMarker({
            title: 'Current Location',
            icon: 'red',
            animation: 'DROP',
            position: {
              lat: this.coordinates.latitude,
              lng: this.coordinates.longitude
            },
            draggable: true
          })
          .then(marker => {
            this.marker = marker;
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
              });
          });

      });
  }
}
