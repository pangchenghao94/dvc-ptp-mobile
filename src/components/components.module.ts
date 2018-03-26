import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DrawingCanvasComponent } from './drawing-canvas/drawing-canvas';
@NgModule({
	declarations: [DrawingCanvasComponent],
	imports: [IonicModule],
	exports: [DrawingCanvasComponent]
})
export class ComponentsModule {}
