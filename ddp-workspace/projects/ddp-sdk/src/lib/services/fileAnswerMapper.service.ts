import { Injectable } from '@angular/core';

@Injectable()
export class FileAnswerMapperService {

  static mapMimeTypesToFileExtentions(mimeTypes: string[]): string[] {
      return mimeTypes.map((mimeType: string) => {
          const [type, subtype] = mimeType.split('/');
          return '*.' + subtype;
      });
  }
}
