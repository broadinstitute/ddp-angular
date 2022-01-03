import { Pipe, PipeTransform } from '@angular/core';
import { FILE_SIZE_MEASURE } from '../models/fileSizeMeasure';

@Pipe({
    name: 'fileSize'
})
export class FileSizeFormatterPipe implements PipeTransform {

    transform(value: number): string {
        let resValue: number;
        const round = 2; // digits after comma
        const limit = 1024; // 1024 bytes

        if (value === 0) {
            return `0 ${FILE_SIZE_MEASURE.bytes}`;
        }

        let exponent = Math.floor(Math.log(value) / Math.log(limit));
        if (exponent < 0) {
            exponent = 0;
        }

        const val = value / (Math.pow(2, exponent * 10));
        const p = Math.pow(10, exponent > 0 ? round : 0);

        resValue = Math.round(val * p) / p;
        if (resValue === limit) {
            resValue = 1;
            exponent++;
        }
        const resMeasure = this.getMeasure(exponent, resValue === 1);

        return `${resValue} ${resMeasure}`;
    }
     private getMeasure(exponent: number, isSingleForm: boolean): string {
         if (exponent === 0) {
             return isSingleForm ? FILE_SIZE_MEASURE.byte : FILE_SIZE_MEASURE.bytes;
         }

         return exponent === 1 ? 'KB' : 'MB';
     }
}
