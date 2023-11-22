import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDrapAndDrop]'
})
export class DrapAndDropDirective {
  @HostListener('class.fileover') fileOver!:boolean;
  constructor() { }


  @HostListener('dragover',['$event']) onDragOver(evt:any){
 evt.preventDefault();
 evt.stopPropagation();
this.fileOver =true
  }

  @HostListener('dragleave',['$event']) public onDragLeave(evt:any){
evt.preventDefault();
evt.stopPropagation()
  }

  @HostListener('drop',['$event']) public ondrop(evt:any){
    evt.preventDefault();
evt.stopPropagation();
this.fileOver = false;
const files= evt.dataTransfer.files;

if(files.length >0){

}
}
}
