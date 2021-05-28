import { FileSizeFormatterPipe } from './fileSizeFormatter.pipe';
import { FILE_SIZE_MEASURE } from '../models/fileSizeMeasure';

describe('FileSizeFormatterPipe', () => {
    const pipe = new FileSizeFormatterPipe();

    it('should create pipe', () => {
        expect(pipe).toBeTruthy();
    });

    it('should format file size in kB', () => {
        expect(pipe.transform(1024, FILE_SIZE_MEASURE.kB)).toBe(1);
    });

    it('should format file size in Mb', () => {
        expect(pipe.transform(2000000, FILE_SIZE_MEASURE.Mb)).toBe(1.91);
    });
});
