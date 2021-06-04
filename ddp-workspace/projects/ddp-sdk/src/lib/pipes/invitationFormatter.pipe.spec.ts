import { InvitationPipe } from './invitationFormatter.pipe';

describe('InvitationPipe test', () => {
    const pipe = new InvitationPipe();

    it('should create pipe', () => {
        expect(pipe).toBeTruthy();
    });

    it('should format invitation code by default', () => {
        expect(pipe.transform('111111111111')).toBe('1111 - 1111 - 1111');
    });

    it('should format invitation code using custom chunk size', () => {
        expect(pipe.transform('111111111111', 3)).toBe('111 - 111 - 111 - 111');
    });

    it('should format invitation code using custom chunk size and custom separator', () => {
        expect(pipe.transform('111111111111', 6, '~')).toBe('111111~111111');
    });

    it('should not transform invitation code of old format', () => {
        const code = 'f13e21a7-eff9-4203-b307-37131d02e709';
        expect(pipe.transform(code)).toBe(code);
    });
});
