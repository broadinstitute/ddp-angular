import { Pipe, PipeTransform } from '@angular/core';
import { FILE_SIZE_MEASURE } from '../models/fileSizeMeasure';

@Pipe({
    name: 'fileSize'
})
export class FileSizeFormatterPipe implements PipeTransform {
    transform(value: number, measure: FILE_SIZE_MEASURE): number {
        const formattedNumber = value / measure;
        return +(formattedNumber.toFixed(2));
    }
}
