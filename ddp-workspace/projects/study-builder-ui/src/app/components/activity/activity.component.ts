import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConfigurationService } from '../../configuration.service';
import { Translation } from '../../model/translation';
import { Template } from '../../model/template';
import { FormActivityDef } from '../../model/formActivityDef';
import { QuestionBlockDef } from '../../model/questionBlockDef';
import { TextQuestionDef } from '../../model/textQuestionDef';
import { FormSectionDef } from '../../model/formSectionDef';

@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html',
    styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnChanges {
    @Input()
    public activity: FormActivityDef = {} as FormActivityDef;
    sections: Array<FormSectionDef> = [];


    public shouldShowReadonlyHint = false;

    constructor(private config: ConfigurationService) {}

    public get title(): string | null {
        return this.getDefaultTranslationText(this.activity.translatedTitles);
    }

    public get subtitle(): string | null {
        return this.getDefaultTranslationText(this.activity.translatedSubtitles);
    }

    public get readonlyHint(): | string | null {
        return this.getDefaultTranslationTemplateText(this.activity.readonlyHintTemplate);
    }

    private getDefaultTranslationTemplateText(template: Template | null | undefined): string {
        if (!template) {
            return null;
        }

        interface NameValue {
            name: string;
            value: string;
        }
        const varNameToValue: Array<NameValue> = template.variables.map(tempVar =>
            ({ name: tempVar.name, value: this.getDefaultTranslationText(tempVar.translations) }))
            .filter(each => each.value !== null) as Array<NameValue>;

        let templateValue = template.templateText;
        varNameToValue.forEach(varNameToValue =>
            //@TODO handle case where $ is being escaped
            templateValue = templateValue.replace('$' + varNameToValue.name, varNameToValue.value)
        );
        return templateValue;
    }

    private getDefaultTranslationText(translations: Array<Translation> | null | undefined): string | null {
        const text = translations?.find(trans => trans.language === this.config.defaultLanguageCode)?.text;
        return typeof (text) === 'string' ? text : null;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.activity) {
            this.sections = [].concat(changes.activity.currentValue.sections);
            console.log("sections is now: %o", this.sections);
        }
    }
}
