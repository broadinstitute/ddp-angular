import { HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

export class MyHammerConfig extends HammerGestureConfig {
  public buildHammer(element: HTMLElement): Hammer {
    return new Hammer(element, {
      touchAction: 'pan-y'
    });
  }
}
