import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.scss']
})
export class ModalImageComponent {
  @ViewChild('modal', { static: false }) private modal: ElementRef;
  @ViewChild('image', { static: false }) private image: ElementRef;

  constructor(private renderer: Renderer2) { }

  public openModal(event: MouseEvent): void {
    const element = event.target as HTMLImageElement;
    if (element.tagName === 'IMG') {
      this.renderer.addClass(this.modal.nativeElement, 'modal_visible');
      this.renderer.setAttribute(this.image.nativeElement, 'src', element.src);
      this.renderer.setAttribute(this.image.nativeElement, 'alt', element.alt);
    }
  }

  public closeModal(): void {
    this.renderer.removeClass(this.modal.nativeElement, 'modal_visible');
    this.renderer.removeAttribute(this.image.nativeElement, 'src');
    this.renderer.removeAttribute(this.image.nativeElement, 'alt');
  }
}
