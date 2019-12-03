import { Directive, AfterViewInit, HostBinding, Input, ElementRef } from '@angular/core';
import { WindowRef } from '../services/windowRef';

@Directive({
    selector: 'img[lazy-img]'
})
export class LazyLoadImagesDirective implements AfterViewInit {
    @HostBinding('attr.src') srcAttr = '';
    @Input() src: string;

    constructor(
        private el: ElementRef,
        private windowRef: WindowRef) { }

    public ngAfterViewInit(): void {
        this.canUseLazyLoad ? this.lazyLoadImage() : this.loadImage();
    }

    private lazyLoadImage(): void {
        const observer = new IntersectionObserver((entries: any[]) => {
            entries.forEach((entry: any) => {
                if (entry.isIntersecting) {
                    this.loadImage();
                    observer.unobserve(this.el.nativeElement);
                }
            });
        });
        observer.observe(this.el.nativeElement);
    }

    private loadImage(): void {
        this.srcAttr = this.src;
    }

    private get canUseLazyLoad(): boolean {
        return this.windowRef.nativeWindow && 'IntersectionObserver' in this.windowRef.nativeWindow;
    }
}
