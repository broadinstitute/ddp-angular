import { ActivityQuestionBlock, QuestionType } from 'ddp-sdk';

class TestNumberActivityQuestionBlock extends ActivityQuestionBlock<number> {
    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Boolean;
    }

    hasAnswer(): boolean {
        return false;
    }
}

describe('ActivityQuestionBlock', () => {
    describe('convertToString', () => {
        it('returns primitive type converted to string', () => {
            const block = new TestNumberActivityQuestionBlock();
            expect(block.convertToString(1)).toBe('1');
        });
    });
});
