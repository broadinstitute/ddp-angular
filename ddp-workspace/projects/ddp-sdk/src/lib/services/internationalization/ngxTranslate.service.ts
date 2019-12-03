import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { mergeMap, merge } from 'rxjs/operators';

@Injectable()
export class NGXTranslateService {
    constructor(private translate: TranslateService) { }

    public getTranslation(word: string | Array<string>): Observable<object | string> {
        return of(null).pipe(
            merge(this.translate.onLangChange),
            merge(this.translate.onDefaultLangChange),
            mergeMap(() => this.translate.get(word))
        );
    }
}
