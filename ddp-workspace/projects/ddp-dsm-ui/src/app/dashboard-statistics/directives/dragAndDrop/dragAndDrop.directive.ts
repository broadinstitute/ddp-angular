import {
  Directive,
  ElementRef,
  HostListener,
} from '@angular/core';

/**
 * @TODO
 * 1. add some styles while dragover event is triggering
 * 2. improve code reusability
 * 3. check for more edge cases
 */

@Directive({
  selector: '[dragAndDrop]'
})

export class DragAndDropDirective  {
  private draggedElement: HTMLElement;
  private activeEvent: any;

  constructor(private elRef: ElementRef) {
  }


  @HostListener('drop', ['$event']) onDrop(event: any): void {
    event.preventDefault();
    this.activeEvent = event;

    if(!this.isMainContainer) {
      this.swap(this.draggedElement, this.parentNode);
    }

  }

  @HostListener('dragstart', ['$event']) onDragStart(event: any): void {
    this.activeEvent = event;
    this.draggedElement = event.target;
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: any): void {
    event.preventDefault();
    this.activeEvent = event;
  }

  @HostListener('dragover', ['$event']) onDragOver(event: any): void {
    event.preventDefault();
    this.activeEvent = event;
    this.noDropEffect();
  }

  /* local function generators */
  private noDropEffect(): void {
    if(this.isMainContainer) {
      this.activeEvent.dataTransfer.dropEffect = 'move';
    }
  }

  private get isMainContainer(): boolean {
    return this.activeEvent.target === this.elRef.nativeElement;
  }


  private get parentNode(): HTMLElement | null {
      let parentNode: any = this.activeEvent.target.parentNode;
      let count = 0;
      while(parentNode.nodeName !== this.draggedElement.nodeName) {
        parentNode = parentNode.parentNode;
        count++;
        if(count > 200)
          {break;}
      }

      return parentNode;
  }

  private swap(nodeA, nodeB): void {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
    nodeB.parentNode.insertBefore(nodeA, nodeB);
    parentA.insertBefore(nodeB, siblingA);
  }



}
