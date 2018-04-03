import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, Loading} from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  Marker
 } from '@ionic-native/google-maps';
import { GeneralProvider } from '../../../providers/general/general';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';

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
    private general: GeneralProvider, private geoLocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {

      if(this.navParams.get('positionData') != null){
        let temp_coor: any = this.navParams.get('positionData');
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
    let loading: Loading = this.general.displayLoading("Getting the location...");
    this.nativeGeocoder.reverseGeocode(this.marker.getPosition().lat, this.marker.getPosition().lng)
      .then((result: NativeGeocoderReverseResult) => {
        let location: string = "";
        if(result[0].subThoroughfare != null)
          location += result[0].subThoroughfare + ", ";
        if(result[0].thoroughfare != null)
          location += result[0].thoroughfare + ", ";
        if(result[0].locality != null)
          location += result[0].locality + ", ";
        if(result[0].administrativeArea != null)
          location += result[0].administrativeArea;

        let dismissData: any = {
          lat: this.marker.getPosition().lat,
          lng: this.marker.getPosition().lng,
          location    : location 
        }

        loading.dismiss();        
        this.viewCtrl.dismiss(dismissData);
      })
      .catch((error: any) => {
        loading.dismiss();
        this.general.displayUnexpectedError(error);
      });
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
