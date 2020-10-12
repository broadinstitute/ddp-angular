import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { merge, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class NGXTranslateService {
    constructor(private translate: TranslateService) { }

    public getTranslation(word: string, interpolateParams?: object): Observable<string>;
    public getTranslation(words: Array<string>, interpolateParams?: object): Observable<object>;

    public getTranslation(word: string | Array<string>, interpolateParams?: object): Observable<object | string> {
        return merge(
            of(null),
            this.translate.onLangChange,
            this.translate.onDefaultLangChange).pipe(
                mergeMap(() => this.translate.get(word, interpolateParams))
        );
    }

    public getTranslationObject<T>(transKey: string): Observable<T> {
        return merge(
            of(null),
            this.translate.onLangChange,
            this.translate.onDefaultLangChange.asObservable()).pipe(
                mergeMap(() => this.translate.get(transKey))
        );
    }
}
