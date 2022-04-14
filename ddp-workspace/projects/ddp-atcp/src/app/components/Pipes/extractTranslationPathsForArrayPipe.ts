import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'extractTranslationPathsForArray',
})

/**
 * @description
 * Pipe for extracting full paths to array elements when translation of array is needed.
 * The benefit over standard translation pipe is following:
 * In case if custom language dictionary have less array elements defined than in english dictionary,
 * missing array elements will be shown in english.
 */
export class ExtractTranslationPathsForArrayPipe implements PipeTransform {
  constructor(private _translateService: TranslateService) {
  }

  transform(key: string): Observable<string[]> {
    return this._translateService.getTranslation('en').pipe(
      map(x => {
        const translations = this.resolve(key, x);
        if (!!translations) {
          const count = translations.length;
          return [...Array(count).keys()].map((i) => `${key}.${i}`);
        } else {
          return [];
        }
      })
    );
  }

  resolve(path: string, obj: any): any {
    return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj || '');
  }
}
