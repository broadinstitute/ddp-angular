import { Injectable } from '@angular/core';
import { UploadFile } from '../models/uploadFile';
import { ActivityFileAnswerDto } from '../models/activity/activityFileAnswerDto';

@Injectable()
export class FileAnswerMapperService {

  static mapMimeTypesToFileExtentions(mimeTypes: string[]): string[] {
      return mimeTypes.map((mimeType: string) => {
          const [type, subtype] = mimeType.split('/');
          return '*.' + subtype;
      });
  }

  static mapFileAnswerDto(fileToUpload: UploadFile): ActivityFileAnswerDto {
      return {
          fileName: fileToUpload.file.name,
          fileSize: fileToUpload.file.size
      };
  }
}
