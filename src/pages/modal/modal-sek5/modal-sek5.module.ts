import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalSek5Page } from './modal-sek5';

@NgModule({
  declarations: [
    ModalSek5Page,
  ],
  imports: [
    IonicPageModule.forChild(ModalSek5Page),
  ],
  exports: [
    ModalSek5Page
  ]
})
export class ModalSek5PageModule {}
