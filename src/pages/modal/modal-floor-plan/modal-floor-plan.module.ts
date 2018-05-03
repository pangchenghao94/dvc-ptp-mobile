import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalFloorPlanPage } from './modal-floor-plan';
import { ComponentsModule } from '../../../components/components.module';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@NgModule({
  declarations: [
    ModalFloorPlanPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ModalFloorPlanPage),
  ],
  exports: [
    ModalFloorPlanPage
  ],
  providers: [
    ScreenOrientation
  ]
})
export class ModalFloorPlanPageModule {}
