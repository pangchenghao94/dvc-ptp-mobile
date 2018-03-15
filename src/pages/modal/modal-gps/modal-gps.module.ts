import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalGpsPage } from './modal-gps';

@NgModule({
  declarations: [
    ModalGpsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalGpsPage),
  ],
  exports: [ ModalGpsPage ]
})
export class ModalGpsPageModule {}
