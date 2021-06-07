import { FileAnswerMapperService } from './fileAnswerMapper.service';

describe('FileAnswerMapperService', () => {
    it('should map mime types to file extensions', () => {
        expect(FileAnswerMapperService.mapMimeTypesToFileExtentions(['application/pdf', 'image/jpeg']))
            .toEqual(['*.pdf', '*.jpeg']);
    });
});
