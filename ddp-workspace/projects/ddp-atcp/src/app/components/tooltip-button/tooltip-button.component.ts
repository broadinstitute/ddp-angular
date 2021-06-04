import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip-button',
  templateUrl: './tooltip-button.component.html',
  styleUrls: ['./tooltip-button.component.scss'],
})
export class TooltipButtonComponent {
  @Input() message: string;
}
