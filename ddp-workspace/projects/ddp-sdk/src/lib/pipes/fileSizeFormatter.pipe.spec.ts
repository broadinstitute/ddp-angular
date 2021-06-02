import { FileSizeFormatterPipe } from './fileSizeFormatter.pipe';

describe('FileSizeFormatterPipe', () => {
    const pipe = new FileSizeFormatterPipe();

    it('should create pipe', () => {
        expect(pipe).toBeTruthy();
    });

    it('should format file size in KB', () => {
        expect(pipe.transform(1024)).toBe('1KB');
    });

    it('should format file size in MB', () => {
        expect(pipe.transform(2000000)).toBe('1.91MB');
    });
});
