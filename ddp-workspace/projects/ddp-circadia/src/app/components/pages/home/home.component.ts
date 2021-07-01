import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';

import { CompositeDisposable } from 'ddp-sdk';

import { Route } from '../../../constants/route';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  Route = Route;
  private fragment$ = new ReplaySubject<string | null | undefined>(1);
  private headerHeight = 10;
  private subs = new CompositeDisposable();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeFragmentSub = this.route.fragment.subscribe(fragment =>
      this.fragment$.next(fragment),
    );

    this.subs.addNew(routeFragmentSub);
  }

  ngAfterViewInit(): void {
    const fragmentSub = this.fragment$.subscribe(fragment => {
      if (fragment === null) {
        return;
      }

      if (fragment === undefined) {
        return this.scrollToTop();
      }

      this.scrollToAnchor(fragment);
    });

    this.subs.addNew(fragmentSub);
  }

  ngOnDestroy(): void {
    this.subs.removeAll();
  }

  private scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  private scrollToAnchor(anchor: string): void {
    const el: HTMLElement = document.getElementById(anchor);

    if (!el) {
      return;
    }

    const currentFontSize = +getComputedStyle(
      document.documentElement,
    ).fontSize.replace('px', '');

    const yOffset = el.offsetTop - this.headerHeight * currentFontSize;

    window.scrollTo(0, yOffset);
  }
}
