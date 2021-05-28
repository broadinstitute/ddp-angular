import { Pipe, PipeTransform } from '@angular/core';
import { FILE_SIZE_MEASURE } from '../models/fileSizeMeasure';

@Pipe({
    name: 'fileSize'
})
export class FileSizeFormatterPipe implements PipeTransform {
    transform(value: number): string {
        const isFileSizeLessThenOneMb = value < FILE_SIZE_MEASURE.Mb;
        const fractionDigits = isFileSizeLessThenOneMb ? 0 : 2;
        const measure = isFileSizeLessThenOneMb ? FILE_SIZE_MEASURE.kB : FILE_SIZE_MEASURE.Mb;
        return (value / measure).toFixed(fractionDigits) + FILE_SIZE_MEASURE[measure];
    }
}
