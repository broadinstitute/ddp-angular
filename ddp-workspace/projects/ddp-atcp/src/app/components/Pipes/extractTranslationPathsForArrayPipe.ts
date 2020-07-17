import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
  async transform(key: any): Promise<any[]> {
    return await this._translateService.getTranslation('en').toPromise()
      .then(x => {
        const translations = this.resolve(key, x);
        if (!!translations) {
          const count = translations.length;
          return [...Array(count).keys()].map((i) => `${key}.${i}`);
        } else {
          return [];
        }
      });
  }

  resolve(path, obj): any {
    return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj || self);
  }
}
