import {Directive, ElementRef, HostListener, OnInit} from "@angular/core";

@Directive({
  selector: '[dragAndDrop]'
})

export class DragAndDropDirective implements OnInit {

  constructor(private elRef: ElementRef) {
  }

  ngOnInit() {
    console.log(this.elRef)
    this.elRef.nativeElement.setAttribute('id', 'dragArea')
  }

  @HostListener('drop', ['$event']) onDrop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    if(event.target.id === 'dragArea') {
      event.target.appendChild(document.getElementById(data));
    }
  }

  @HostListener('dragstart', ['$event']) onDragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event) {
    event.preventDefault();
  }

  @HostListener('dragover', ['$event']) onDragOver(event) {
    event.preventDefault();
  }


}
