import { Directive, AfterViewInit, Input, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { WindowRef } from '../services/windowRef';


// TODO: fix the linter error "The selector should be camelCase" in a separate PR
/* eslint-disable @angular-eslint/directive-selector */
@Directive({
    selector: '[lazy-resource]'
})
export class LazyLoadResourcesDirective implements AfterViewInit, OnChanges {
    @Input() src: string;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private windowRef: WindowRef) { }

    public ngOnChanges(changes: SimpleChanges): void {
      if (changes['src'] && !changes['src'].isFirstChange()) {
        this.checkAndLazyLoad();
      }
    }

    public ngAfterViewInit(): void {
        this.checkAndLazyLoad();
    }

    private checkAndLazyLoad(): void {
      if (this.canUseLazyLoad()) {
        this.renderer.setAttribute(this.el.nativeElement, 'src', '');
        this.lazyLoadResource();
      }
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
        this.renderer.setAttribute(this.el.nativeElement, 'src', this.src);
    }

    private canUseLazyLoad(): boolean {
        return this.windowRef.nativeWindow && 'IntersectionObserver' in this.windowRef.nativeWindow;
    }
}
