import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalGpsPage } from './modal-gps';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';

@NgModule({
  declarations: [
    ModalGpsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalGpsPage),
    Geolocation,
    GoogleMaps
  ],
})
export class ModalGpsPageModule {}
