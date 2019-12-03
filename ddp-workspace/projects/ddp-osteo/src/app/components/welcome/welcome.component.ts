import { Component, ViewChild, ElementRef } from '@angular/core';
import { WindowRef } from 'ddp-sdk';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  private readonly HEADER_HEIGHT_REM = 7;
  @ViewChild('scrollAnchor', { static: true }) scrollAnchor: ElementRef;

  constructor(private window: WindowRef) { }

  public scrollToStepsSection(): void {
    const top = this.scrollAnchor.nativeElement.getBoundingClientRect().top + window.scrollY - this.getRealHeaderHeight;
    this.window.nativeWindow.scrollTo({
      top,
      behavior: 'smooth'
    });
  }

  private get getRealHeaderHeight(): number {
    return this.HEADER_HEIGHT_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
}
