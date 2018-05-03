import { Component, Renderer2, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';

/**
 * Generated class for the DrawingCanvasComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'drawing-canvas',
  templateUrl: 'drawing-canvas.html'
})
export class DrawingCanvasComponent {

    @ViewChild('myCanvas') canvas: any;
 
    canvasElement: any;
    lastX: number;
    lastY: number;
 
    currentColour: string = '#000';
    availableColours: any;
 
    brushSize: number = 5;
 
    constructor(public platform: Platform, public renderer: Renderer2) {
        this.availableColours = [
            '#000',
            '#1abc9c',
            '#3498db',
            '#9b59b6',
            '#e67e22',
            '#e74c3c'
        ];
    }
 
    ngAfterViewInit(){
 
        this.canvasElement = this.canvas.nativeElement;
        
        let deductHeight: any =0;
        if(this.platform.is("ios"))
            deductHeight = 44 + 63 + 2 + 26;    
        else if(this.platform.is("android"))
            deductHeight = 56 + 54 + 2;
        
        console.log("deductHeight: " + deductHeight);
        this.renderer.setAttribute(this.canvasElement, 'width', this.platform.width() + '');
        this.renderer.setAttribute(this.canvasElement, 'height', this.platform.height() - deductHeight + '');
    }
 
    changeColour(colour){
        this.currentColour = colour;
    }
 
    changeSize(size){
        this.brushSize = size;
    }
 
    handleStart(ev){
        let deductHeight: any = 0;

        if(this.platform.is("ios"))
            deductHeight = 44 + 26;
        else if(this.platform.is("android"))
            deductHeight = 56;

        this.lastX = ev.touches[0].pageX;
        this.lastY = ev.touches[0].pageY - deductHeight;
    }
 
    handleMove(ev){
        let deductHeight: any = 0;

        if(this.platform.is("ios"))
            deductHeight = 44 + 26;
        else if(this.platform.is("android"))
            deductHeight = 56;

        let ctx = this.canvasElement.getContext('2d');
        let currentX = ev.touches[0].pageX;
        let currentY = ev.touches[0].pageY - deductHeight;
 
        ctx.beginPath();
        ctx.lineJoin = "round";
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(currentX, currentY);
        ctx.closePath();
        ctx.strokeStyle = this.currentColour;
        ctx.lineWidth = this.brushSize;
        ctx.stroke();      
 
        this.lastX = currentX;
        this.lastY = currentY;
    }
 
    clearCanvas(){
        let ctx = this.canvasElement.getContext('2d');
        ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);  
    }
}
