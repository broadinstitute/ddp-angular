import { Injectable, Inject } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollerService {
  constructor(
    private location: Location,
    @Inject(DOCUMENT) private document: Document) { }

  public scrollToAnchor(anchor: string): void {
    const hash = this.location.path(true);
    if (hash.indexOf(anchor) === -1) {
      return;
    }
    const element = this.document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }
}
