import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalUpdateUserDetailsPage } from './modal-update-user-details';

@NgModule({
  declarations: [
    ModalUpdateUserDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalUpdateUserDetailsPage),
  ],
})
export class ModalUpdateUserDetailsPageModule {}
