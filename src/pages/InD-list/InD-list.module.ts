import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InDListPage } from './InD-list';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [
    InDListPage,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(InDListPage),
  ],
})
export class InDListPageModule {}
