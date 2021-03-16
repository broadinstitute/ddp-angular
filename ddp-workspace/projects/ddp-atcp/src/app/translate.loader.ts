import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export class AppTranslateLoader implements TranslateLoader {
  private _cachedLangMap: Record<string, any> = {};

  constructor(private _http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    if (this._cachedLangMap[lang]) {
      return of(this._cachedLangMap[lang]);
    }

    return this._http.get(`/assets/i18n/${lang}.json`).pipe(
      tap(translations => {
        this._cachedLangMap[lang] = translations;
      })
    );
  }
}
