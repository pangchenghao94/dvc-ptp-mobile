import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalExhibitPage } from './modal-exhibit';

@NgModule({
  declarations: [
    ModalExhibitPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalExhibitPage),
  ],
  exports: [ ModalExhibitPage ]
})
export class ModalExhibitPageModule {}
