import { Directive, AfterViewInit, Input, ElementRef, Renderer2 } from '@angular/core';
import { WindowRef } from '../services/windowRef';

@Directive({
    selector: 'img[lazy-img]'
})
export class LazyLoadImagesDirective implements AfterViewInit {
    @Input() src: string;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private windowRef: WindowRef) { }

    public ngAfterViewInit(): void {
        this.canUseLazyLoad ? this.lazyLoadImage() : this.loadImage();
    }

    private lazyLoadImage(): void {
        const options = {
            rootMargin: '0px 0px 300px 0px'
        };
        const observer = new IntersectionObserver((entries: any[]) => {
            entries.forEach((entry: any) => {
                if (entry.isIntersecting) {
                    this.loadImage();
                    observer.unobserve(this.el.nativeElement);
                }
            });
        }, options);
        observer.observe(this.el.nativeElement);
    }

    private loadImage(): void {
        this.renderer.setAttribute(this.el.nativeElement, 'src', this.src)
    }

    private get canUseLazyLoad(): boolean {
        return this.windowRef.nativeWindow && 'IntersectionObserver' in this.windowRef.nativeWindow;
    }
}
