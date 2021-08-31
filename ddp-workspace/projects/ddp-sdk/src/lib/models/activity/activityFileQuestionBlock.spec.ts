import { ActivityFileQuestionBlock } from './activityFileQuestionBlock';

describe('ActivityFileQuestionBlock', () => {
    it('isUniqueValues returns true always', () => {
        const block = new ActivityFileQuestionBlock();
        const file = { fileName: 'test', fileSize: 10 };
        expect(block.isUniqueValues([file, file])).toBeTrue();
    });
});
