import { Directive, AfterViewInit, Input, ElementRef, Renderer2 } from '@angular/core';
import { WindowRef } from '../services/windowRef';

@Directive({
    selector: '[lazy-resource]'
})
export class LazyLoadResourcesDirective implements AfterViewInit {
    @Input() src: string;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private windowRef: WindowRef) { }

    public ngAfterViewInit(): void {
        this.canUseLazyLoad ? this.lazyLoadResource() : this.loadResource();
    }

    private lazyLoadResource(): void {
        const options = {
            rootMargin: '0px 0px 300px 0px'
        };
        const observer = new IntersectionObserver((entries: any[]) => {
            entries.forEach((entry: any) => {
                if (entry.isIntersecting) {
                    this.loadResource();
                    observer.unobserve(this.el.nativeElement);
                }
            });
        }, options);
        observer.observe(this.el.nativeElement);
    }

    private loadResource(): void {
        this.renderer.setAttribute(this.el.nativeElement, 'src', this.src)
    }

    private get canUseLazyLoad(): boolean {
        return this.windowRef.nativeWindow && 'IntersectionObserver' in this.windowRef.nativeWindow;
    }
}
