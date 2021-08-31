import { ActivityQuestionBlock, QuestionType } from 'ddp-sdk';

class TestNumberActivityQuestionBlock extends ActivityQuestionBlock<number> {
    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Boolean;
    }
}

describe('ActivityQuestionBlock', () => {
    describe('isUniqueValues', () => {
        it('returns true if values are unique for activty question of primitive type', () => {
            const block = new TestNumberActivityQuestionBlock();
            expect(block.isUniqueValues([1, 2, 4])).toBeTrue();
        });

        it('returns false if values are unique for activty question of primitive type', () => {
            const block = new TestNumberActivityQuestionBlock();
            expect(block.isUniqueValues([1, 2, 2, 4])).toBeFalse();
        });
    });
});
