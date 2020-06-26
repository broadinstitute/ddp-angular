import { Component, Input, Inject } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';

@Component({
    selector: 'ddp-tooltip',
    template: `
        <img class="tooltip__icon" 
             [src]="icon" 
             [alt]="'SDK.TooltipAlt' | translate"
             [matTooltip]="text"
             matTooltipClass="tooltip__box"
             [matTooltipPosition]="position"
             (click)="tooltip.toggle()"
             #tooltip="matTooltip">`
})
export class TooltipComponent {
    @Input() icon = this.config.tooltipIconUrl;
    @Input() text: string;
    @Input() position = 'right';

    constructor(@Inject('ddp.config') private config: ConfigurationService) { }
}
