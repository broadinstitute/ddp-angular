import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class BrowserContentService {
    private warningEvents: Subject<void> = new Subject<void>();
    public events: Observable<void> = this.warningEvents.asObservable();

    constructor(@Inject(DOCUMENT) private document: any) { }

    public emitWarningEvent(): void {
        this.warningEvents.next();
    }

    public unsupportedBrowser(): boolean {
        return this.document['documentMode'];
    }
}