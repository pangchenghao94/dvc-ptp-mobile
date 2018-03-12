import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalChangePasswordPage } from './modal-change-password';

@NgModule({
  declarations: [
    ModalChangePasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalChangePasswordPage),
  ],
  exports: [ ModalChangePasswordPage ]
})
export class ModalChangePasswordPageModule {}
