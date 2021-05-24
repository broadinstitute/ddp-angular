import { StickyScrollDirective } from './sticky-scroll.directive';
import { TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { WindowRef } from 'ddp-sdk';

const notRecognizableTopSpace = 73;
const containerHeight = 50;
// less then container height in order to see the scroll
const windowHeight = containerHeight - 10 + notRecognizableTopSpace;

function getTestComponentTemplateWithStyles({hostWidth = '100px', padding = '0'}: {hostWidth?: string; padding?: string} = {}): string {
  return `<div style="height: 150px; padding-top: ${padding}; display: block; overflow-y: auto;">
               <div class="directive-host"
                    sticky-scroll
                    style="width: ${hostWidth}; height: ${containerHeight}px; white-space: nowrap; overflow: auto;">
                 <span>very very very very long long long long looong content</span>
               </div>
             </div>`;
}


@Component({
  template: getTestComponentTemplateWithStyles()
})
class TestStickyScrollComponent {}

describe('Directive: StickyScrollDirective', () => {
  let windowRefMock: WindowRef;
  let stickyScrollbar: DebugElement;
  let directiveHost: DebugElement;

  // have to move out from beforeEach since updated provider works for the directive only after recreating component
  function setupComponent(): void {
    const fixture = TestBed.createComponent(TestStickyScrollComponent);
    fixture.detectChanges();
    stickyScrollbar = fixture.debugElement.query(By.css('.sticky-scrollbar'));
    directiveHost = fixture.debugElement.query(By.css('.directive-host'));
  }

  function checkScrollbarIsVisible(): void {
    expect(stickyScrollbar.styles['visibility']).toBe('visible');
  }

  function checkScrollbarIsHidden(): void {
    expect(stickyScrollbar.styles['visibility']).toBe('hidden');
  }

  beforeEach(() => {
    windowRefMock = {nativeWindow: {innerHeight: windowHeight}} as WindowRef;
    TestBed.configureTestingModule({
      declarations: [StickyScrollDirective, TestStickyScrollComponent],
      providers: [{ provide: WindowRef, useFactory: () => windowRefMock }],
    });
    TestBed.overrideTemplateUsingTestingModule(TestStickyScrollComponent, getTestComponentTemplateWithStyles());
  });

  it('should add sticky-scrollbar element', () => {
    setupComponent();
    expect(stickyScrollbar).toBeTruthy();
  });

  it('should show sticky scrollbar', () => {
    setupComponent();
    const {nativeElement} = directiveHost;

    // double check the element has scrollbar
    expect(nativeElement.scrollWidth > nativeElement.clientWidth).toBeTrue();
    checkScrollbarIsVisible();
  });

  it('should hide sticky scrollbar when native scrollbar is visible', () => {
    windowRefMock = {nativeWindow: {innerHeight: containerHeight + 10 + notRecognizableTopSpace}} as WindowRef;
    setupComponent();

    checkScrollbarIsHidden();
  });

  it('should hide sticky scrollbar when component does not have horizontal scrollbar', () => {
    TestBed.overrideTemplateUsingTestingModule(TestStickyScrollComponent, getTestComponentTemplateWithStyles({
      hostWidth: '1000px'
    }));
    setupComponent();
    const {nativeElement} = directiveHost;

    expect(nativeElement.scrollWidth <= nativeElement.clientWidth).toBeTrue();
    checkScrollbarIsHidden();
  });

  it('should hide sticky scrollbar when component is not visible', () => {
    TestBed.overrideTemplateUsingTestingModule(TestStickyScrollComponent, getTestComponentTemplateWithStyles({
      padding: '100px'
    }));
    setupComponent();

    checkScrollbarIsHidden();
  });

  it('should refresh the directive on window resize', () => {
    setupComponent();

    const refreshSpy = spyOn(directiveHost.injector.get(StickyScrollDirective), 'refresh');
    window.dispatchEvent(new Event('resize'));

    expect(refreshSpy).toHaveBeenCalled();
  });
});
