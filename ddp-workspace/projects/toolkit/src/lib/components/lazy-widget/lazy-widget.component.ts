import { BehaviorSubject } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  template: ''
})
export class LazyWidgetComponent implements OnDestroy {
    private readonly options = {
      rootMargin: '0px',
      threshold: 0
    };

    private readonly observer = new IntersectionObserver(
      this.onIntersectionChanged.bind(this),
      this.options
    );

  private isVisible = false;

  protected readonly isWidgetVisible = new BehaviorSubject(false)
    .pipe(filter(value => value)) as BehaviorSubject<boolean>;

  constructor(private observedElement: HTMLElement) {
    this.observer.observe(observedElement);
  }

  ngOnDestroy(): void {
    this.isWidgetVisible.unsubscribe();
  }

  private onIntersectionChanged(entries: IntersectionObserverEntry[]): void {
    if (!entries.length) {
      console.warn('No entries found!');
      return;
    }
    if (!this.isVisible && entries[0].isIntersecting) {
      this.isVisible = true;
      this.observer.unobserve(this.observedElement);
      this.isWidgetVisible.next(true);
    }
  }
}
