import { Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ActivityPicklistQuestionBlock } from '../../../models/activity/activityPicklistQuestionBlock';
import { ActivityPicklistAnswerDto } from '../../../models/activity/activityPicklistAnswerDto';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';
import { Subscription } from 'rxjs';

export class BaseActivityPicklistQuestion implements OnChanges, OnDestroy {
    @Input() block: ActivityPicklistQuestionBlock;
    @Input() readonly: boolean;
    @Output() valueChanged: EventEmitter<Array<ActivityPicklistAnswerDto>> = new EventEmitter();
    public questionIdToCharactersLeft: Record<string, number> = {};
    public questionIdToCharacterLeftMsg: Record<string, string> = {};
    private pluralForm: string;
    private singularForm: string;
    private anchor: Subscription = new Subscription();

    constructor(private ngxTranslate: NGXTranslateService) { }

    public ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            if (propName === 'block') {
                const translationKeys = ['SDK.DetailsPlaceholder.PluralForm', 'SDK.DetailsPlaceholder.SingularForm'];
                const text = this.ngxTranslate.getTranslation(translationKeys).subscribe((translationValues: object) => {
                    this.pluralForm = translationValues[translationKeys[0]];
                    this.singularForm = translationValues[translationKeys[1]];
                    this.block.picklistOptions.forEach(item => {
                        if (item.allowDetails) {
                            this.updateCharactersLeftIndicator(item.stableId);
                        }
                    });
                });
                this.anchor.add(text);
            }
        }
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public updateCharactersLeftIndicator(id: string, value?: string): void {
        const answer = (value || value === '') ? value : this.getSavedAnswer(id);
        let difference = this.block.detailMaxLength - answer.length;
        difference = difference < 0 ? 0 : difference;
        this.questionIdToCharactersLeft[id] = difference;
        this.questionIdToCharacterLeftMsg[id] = ` ${difference === 1 ? this.singularForm : this.pluralForm}`;
    }

    public getAnswerDetailText(id: string): string | null {
        if (this.block.answer) {
            const details: string[] = this.block.answer
                .filter(item => item.stableId === id)
                .map(item => item.detail);
            return details.length ? details[0] : null;
        } else {
            return null;
        }
    }

    private getSavedAnswer(id: string): string {
        let answer = '';
        if (this.block.answer) {
            this.block.answer.forEach((item) => {
                if (item.stableId === id) {
                    answer = item.detail ? item.detail : '';
                }
            });
        }
        return answer;
    }
}
