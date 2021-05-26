import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityFileQuestionBlock } from '../../../models/activity/activityFileQuestionBlock';
import { ActivityFileAnswerDto } from '../../../models/activity/activityFileAnswerDto';

export class ActivityFileValidationRule extends ActivityAbstractValidationRule {
    constructor(private block: ActivityFileQuestionBlock) {
        super(block);
    }

    public recalculate(answerBeforeUpload?: ActivityFileAnswerDto): boolean {
        const answer = answerBeforeUpload || this.block.answer;

        if (this.isMaxFileSizeExceeded(answer)) {
            this.result = 'File size exceeded maximum of 100 bytes';
            return false;
        }

        if (this.isNotAllowedFileType(answer)) {
            this.result = 'Mime type not belongs to allowed list';
            return false;
        }

        this.result = null;
        return true;
    }

    private isMaxFileSizeExceeded(answer: ActivityFileAnswerDto): boolean {
        return this.block.maxFileSize && answer && answer.fileSize > this.block.maxFileSize;
    }

    private isNotAllowedFileType(answer: ActivityFileAnswerDto): boolean {
        const allowedFileTypes = this.block.mimeTypes?.length ? this.block.mimeTypes : null;
        const fileExtension = answer && answer.fileMimeType;
        return allowedFileTypes && fileExtension && !allowedFileTypes.includes(fileExtension);
    }
}
