import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityFileQuestionBlock } from '../../../models/activity/activityFileQuestionBlock';
import { ActivityFileAnswerDto } from '../../../models/activity/activityFileAnswerDto';

enum FILE_VALIDATION_MESSAGE {
  maxSize = 'SDK.FileUpload.MaxSizeErrorMessage',
  invalidType = 'SDK.FileUpload.InvalidTypeErrorMessage'
}

export class ActivityFileValidationRule extends ActivityAbstractValidationRule {
    constructor(private block: ActivityFileQuestionBlock) {
        super(block);
    }

    public recalculate(answerBeforeUpload?: ActivityFileAnswerDto): boolean {
        const answer = answerBeforeUpload;

        if (this.isMaxFileSizeExceeded(answer)) {
            this.result = FILE_VALIDATION_MESSAGE.maxSize;
            return false;
        }

        if (this.isNotAllowedFileType(answer)) {
            this.result = FILE_VALIDATION_MESSAGE.invalidType;
            return false;
        }

        this.result = null;
        return true;
    }

    private isMaxFileSizeExceeded(answer: ActivityFileAnswerDto): boolean {
        return this.block.maxFileSize && answer?.fileSize > this.block.maxFileSize;
    }

    private isNotAllowedFileType(answer: ActivityFileAnswerDto): boolean {
        const allowedFileTypes = this.block.mimeTypes?.length ? this.block.mimeTypes : null;
        const fileType = answer?.fileMimeType;
        return allowedFileTypes && fileType && !allowedFileTypes.includes(fileType);
    }
}
