import { AfterViewInit, OnDestroy, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { WindowRef } from '../services/windowRef';

/**
 * Sticky bottom scroll for any container. Currently we use it with table only but might be used on other elements.
 * This directive creates dom element with scrollbar which syncs with host element's scrollbar
 * and operates on this visibility and position.
 * This scrollbar may be customized via styles as any other browser native scrollbar.
 *
 * The scrollbar's size, position, visibility are updated on window resize, window scroll and host element scroll.
 * In order to update it outside of directive use the directive instance refresh() method.
 */
@Directive({
  selector: '[stickyScroll]'
})
export class StickyScrollDirective implements AfterViewInit, OnDestroy {
  private readonly element: HTMLElement;
  private readonly scroller: HTMLElement;
  private readonly scrollerInner: HTMLElement;
  private readonly scrollerSize = 30;
  private scrollUnlistener!: () => void;
  private ignoreScrollEvents = false;

  @HostListener('scroll')
  onScroll(): void {
    this.scroller.scrollLeft = this.element.scrollLeft;
    this.ignoreScrollEvents = true;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.refresh();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateVisibility();
    this.updatePosition();
  }

  constructor(
    _el: ElementRef,
    private renderer: Renderer2,
    private windowRef: WindowRef,
    ) {
    this.element = _el.nativeElement;
    this.scroller = this.renderer.createElement('div');
    this.renderer.addClass(this.scroller, 'sticky-scrollbar');
    this.scrollerInner = this.renderer.createElement('div');
    this.renderer.appendChild(this.scroller, this.scrollerInner);

    this.initializeScroller();
  }

  ngAfterViewInit(): void {
    this.renderer.appendChild(this.element, this.scroller);
    this.refresh();
  }

  private initializeScroller(): void {
    this.renderer.setStyle(this.scroller, 'position', 'fixed');
    this.renderer.setStyle(this.scroller, 'bottom', '0');
    this.renderer.setStyle(this.scroller, 'height', `${this.scrollerSize}px`);
    this.renderer.setStyle(this.scroller, 'z-index', `1`);
    this.renderer.setStyle(this.scroller, 'overflow-x', 'auto');
    this.renderer.setStyle(this.scroller, 'overflow-y', 'hidden');

    this.hideScroller();
    this.scrollUnlistener = this.renderer.listen(this.scroller, 'scroll', () => {
      if (!this.ignoreScrollEvents) {
        this.element.scrollLeft = this.scroller.scrollLeft;
      }
      this.ignoreScrollEvents = false;
    });

    // in order to make scrollbar for scroller appear
    this.renderer.setStyle(this.scrollerInner, 'border', '1px solid #fff');
    this.renderer.setStyle(this.scrollerInner, 'opacity', '0.01');
  }

  /**
   * Use visibility visible/hidden instead of display block/none
   * in order to properly sync custom scrollbar scroll position when it's hidden
   */
  private showScroller(): void {
    this.renderer.setStyle(this.scroller, 'visibility', 'visible');
  }

  private hideScroller(): void {
    this.renderer.setStyle(this.scroller, 'visibility', 'hidden');
  }

  refresh(): void {
    this.updateVisibility();
    this.updatePosition();
    this.updateSize();
  }

  private updateVisibility(): void {
    if (this.isStickyScrollbarVisible()) {
      this.showScroller();
    } else {
      this.hideScroller();
    }
  }

  private updatePosition(): void {
    if (this.isStickyScrollbarVisible()) {
      const {left: elementLeft} = this.element.getBoundingClientRect();
      this.renderer.setStyle(this.scroller, 'left', `${elementLeft}px`);
    }
  }

  private updateSize(): void {
    if (this.isStickyScrollbarVisible()) {
      this.renderer.setStyle(this.scroller, 'width', `${this.element.clientWidth}px`);
      this.renderer.setStyle(this.scrollerInner, 'width', `${this.element.scrollWidth}px`);
    }
  }

  isStickyScrollbarVisible(): boolean {
    return this.isElementVisible() && !this.isNativeScrollFullyVisible() && this.elementHasScrollbar();
  }

  private elementHasScrollbar(): boolean {
    return this.element.scrollWidth > this.element.clientWidth;
  }

  private isElementVisible(): boolean {
    const {top, bottom} = this.element.getBoundingClientRect();
    // should be enough space to show sticky scroll
    return (top + this.scrollerSize) < this.windowRef.nativeWindow.innerHeight && bottom > 0;
  }

  private isNativeScrollFullyVisible(): boolean {
    const {bottom} = this.element.getBoundingClientRect();
    return bottom <= this.windowRef.nativeWindow.innerHeight;
  }

  ngOnDestroy(): void {
    this.scrollUnlistener();
    this.renderer.removeChild(this.element, this.scroller);
  }
}
