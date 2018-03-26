import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPremiseLocationPage } from './modal-premise-location';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ModalPremiseLocationPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ModalPremiseLocationPage),
  ],
  exports: [
    ModalPremiseLocationPage
  ]
})
export class ModalPremiseLocationPageModule {}
