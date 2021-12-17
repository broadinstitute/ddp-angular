/* eslint-disable max-classes-per-file */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LazyLoadResourcesDirective, WindowRef } from 'ddp-sdk';

describe('LazyLoadResourcesDirective', () => {
  @Component({
    template: `
        <img lazy-resource [src]="src" alt=""/>`
  })
  class TestHostComponent {
    src = 'http://test';
  }

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(waitForAsync(() => {
    class IntersectionObserver {
      observe: () => void;
      unobserve: () => void;

      constructor(
        public callback: (entries: Array<IntersectionObserverEntry>) => void
      ) {
        this.observe = () => {
          this.callback([{isIntersecting: true} as IntersectionObserverEntry]);
        };
        this.unobserve = jasmine.createSpy('unobserve');
      }
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    (window as any).IntersectionObserver = IntersectionObserver;

    TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
        LazyLoadResourcesDirective
      ],
      providers: [
        { provide: WindowRef, useValue: {nativeWindow: {IntersectionObserver: {}}} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('updates src', () => {
    const img = fixture.debugElement.query(By.css('img')).nativeElement;
    expect(img.src).toBe('http://test/');

    const updatedSrc = 'http://test-updated/';
    component.src = updatedSrc;
    fixture.detectChanges();
    expect(img.src).toBe(updatedSrc);
  });
});
