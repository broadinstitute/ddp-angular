import { FileSizeFormatterPipe } from './fileSizeFormatter.pipe';

describe('FileSizeFormatterPipe', () => {
    const pipe = new FileSizeFormatterPipe();

    it('should create pipe', () => {
        expect(pipe).toBeTruthy();
    });

    it('should format file size in bytes', () => {
        expect(pipe.transform(0)).toBe('0 bytes');
        expect(pipe.transform(1)).toBe('1 byte');
        expect(pipe.transform(100)).toBe('100 bytes');
    });

    it('should format file size in KB', () => {
        expect(pipe.transform(1024)).toBe('1 KB');
        expect(pipe.transform(500000)).toBe('488.28 KB');
    });

    it('should format file size in MB', () => {
        expect(pipe.transform(1024 * 1024)).toBe('1 MB');
        expect(pipe.transform(2000000)).toBe('1.91 MB');
    });
});
