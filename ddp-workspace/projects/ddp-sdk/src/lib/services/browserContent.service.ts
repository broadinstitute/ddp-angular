import { Injectable, Inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class BrowserContentService {
    public events: Observable<void> = this.warningEvents.asObservable();
    private warningEvents: Subject<void> = new Subject<void>();

    constructor(@Inject(DOCUMENT) private document: any) { }

    public emitWarningEvent(): void {
        this.warningEvents.next();
    }

    public unsupportedBrowser(): boolean {
        return this.document['documentMode'];
    }
}
