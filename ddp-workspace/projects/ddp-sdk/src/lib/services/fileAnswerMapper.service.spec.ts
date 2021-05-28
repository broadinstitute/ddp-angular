import { FileAnswerMapperService } from './fileAnswerMapper.service';

describe('FileAnswerMapperService', () => {
    it('should map mime types to file extensions', () => {
        expect(FileAnswerMapperService.mapMimeTypesToFileExtentions(['application/pdf', 'image/jpeg']))
            .toEqual(['*.pdf', '*.jpeg']);
    });

    it('should map mapFileAnswerDto', () => {
        expect(FileAnswerMapperService.mapFileAnswerDto({
            file: {
                name: '1.png',
                size: 1000
            } as File,
            uploadGuid: 'uploadGuid',
            uploadUrl: 'uploadUrl',
            isReadyToUpload: true,
        }))
            .toEqual({
                fileName: '1.png',
                fileSize: 1000
            });
    });
});
