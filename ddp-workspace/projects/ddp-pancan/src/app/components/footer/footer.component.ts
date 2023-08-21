import { Component, Input } from '@angular/core';
import { WindowRef } from 'ddp-sdk';
import { BaseFooterComponent } from './base-footer/base-footer.component';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends BaseFooterComponent {
    @Input() phone: string;
    @Input() email: string;

    constructor(private _windowRef: WindowRef) {
        super(_windowRef);
    }

    public get currentYear(): number {
        return new Date().getFullYear();
    }
}
