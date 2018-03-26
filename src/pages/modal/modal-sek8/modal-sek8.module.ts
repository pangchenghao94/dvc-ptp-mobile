import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalSek8Page } from './modal-sek8';

@NgModule({
  declarations: [
    ModalSek8Page,
  ],
  imports: [
    IonicPageModule.forChild(ModalSek8Page),
  ],
  exports: [
    ModalSek8Page
  ]
})
export class ModalSek8PageModule {}
