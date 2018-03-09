import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InDListPage } from './InD-list';

@NgModule({
  declarations: [
    InDListPage,
  ],
  imports: [
    IonicPageModule.forChild(InDListPage),
  ],
})
export class InDListPageModule {}
