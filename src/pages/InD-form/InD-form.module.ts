import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InDFormPage } from './InD-form';

@NgModule({
  declarations: [
    InDFormPage,
  ],
  imports: [
    IonicPageModule.forChild(InDFormPage),
  ],
})
export class InDFormPageModule {}
