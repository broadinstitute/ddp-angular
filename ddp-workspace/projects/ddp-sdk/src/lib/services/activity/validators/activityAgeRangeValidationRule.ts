import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { DatePickerValue } from '../../../models/datePickerValue';

export class ActivityAgeRangeValidationRule extends ActivityAbstractValidationRule {
    constructor(
        public question: ActivityQuestionBlock<any>,
        public minAge: number | null = null,
        public maxAge: number | null = null) {
        super(question);
    }

    public recalculate(): boolean {
        let valid = true;
        if (this.question.answer !== null && this.isFullDate(this.question.answer)) {
            const age = this.calculateAge();
            if (this.minAge && this.maxAge === null) {
                valid = age < this.minAge ? false : true;
            }
            if (this.maxAge && this.minAge === null) {
                valid = age > this.maxAge ? false : true;
            }
            if (this.maxAge && this.minAge) {
                valid = age >= this.minAge && age <= this.maxAge ? true : false;
            }
        }
        this.result = (valid ? null : this.message);
        return valid;
    }

    private calculateAge(): number {
        const today = new Date();
        const value = this.question.answer;
        const dateOfBirth = new Date(value.year, value.month - 1, value.day);
        let age = today.getFullYear() - dateOfBirth.getFullYear();
        const month = today.getMonth() - dateOfBirth.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < dateOfBirth.getDate())) {
            age--;
        }
        return age;
    }

    private isFullDate(value: DatePickerValue): boolean {
        return value.year !== null && value.month !== null && value.day !== null;
    }
}
