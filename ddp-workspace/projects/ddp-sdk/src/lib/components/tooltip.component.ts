import { Component, Input, Inject, OnInit, OnDestroy } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';
import {
    BreakpointObserver,
    Breakpoints
} from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

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
export class TooltipComponent implements OnInit, OnDestroy {
    @Input() icon = this.config.tooltipIconUrl;
    @Input() text: string;
    @Input() position = 'right';
    destroyed = new Subject<void>();

    constructor(@Inject('ddp.config') private config: ConfigurationService, private breakpointObserver: BreakpointObserver) { }
    ngOnInit(): void {
        const initialPosition = this.position;
        this.breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.XLarge
        ]).pipe(takeUntil(this.destroyed))
            .subscribe(() => {
                this.position = this.breakpointObserver.isMatched(Breakpoints.XSmall) ? 'below' : initialPosition;
        });
    }
    ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
    }
}
