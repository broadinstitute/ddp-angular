import { QuestionBlockDef } from '../core/questionBlockDef';
import { TextQuestionDef } from '../core/textQuestionDef';
import { Template } from '../core/template';
import { Identifiable } from './identifiable';
import { ObservableActivityDef } from './observableActvityDef';
import { BasicActivityDef } from '../core/basicActivityDef';
import { ConfigurationService } from '../../configuration.service';
import { ObservableFormSectionDef } from './observableFormSectionDef';
import { ContentBlockDef } from '../core/contentBlockDef';
import { FormSectionDef } from '../core/formSectionDef';
import { PicklistQuestionDef } from '../core/picklistQuestionDef';
import { AbstractQuestionDef } from '../core/abstractQuestionDef';

export class StudyConfigObjectFactory {
    static idCounter = 0;

    constructor(private config: ConfigurationService) {
    }

    public createDefaultActivityDef(newStudyGuid: string, newActivityCode: string): ObservableActivityDef {
        const basicDef: BasicActivityDef = {
            activityCode: newActivityCode,
            studyGuid: newStudyGuid,
            activityType: 'FORMS',
            formType: 'GENERAL',
            listStyleHint: 'NONE',
            maxInstancesPerUser: 1,
            allowOndemandTrigger: false,
            allowUnauthenticated: false,
            introduction: null,
            closing: null,
            displayOrder: 0,
            excludeFromDisplay: false,
            sections: [],
            snapshotSubstitutionsOnSubmit: false,
            translatedDescriptions: [],
            translatedNames: [{ language: this.config.defaultLanguageCode, text: 'name' }],
            translatedSecondNames: [],
            translatedSubtitles: [],
            translatedSummaries: [],
            translatedTitles: [{ language: this.config.defaultLanguageCode, text: 'title' }],
            validations: [],
            versionTag: 'v1',
            writeOnce: false,
            mappings: []
        };
        const activityDef =  new ObservableActivityDef(basicDef);
        const defaultSection = this.createDefaultSection();
        activityDef.sections = [defaultSection];
        return activityDef;
    }

    public buildObservableActivityDef(basicActivityDef: BasicActivityDef): ObservableActivityDef {
        const newDef = new ObservableActivityDef(basicActivityDef);
        newDef.sections = basicActivityDef.sections.map(section => this.buildObservableSectionDef(section));
        return newDef;
    }

    private buildObservableSectionDef(sectionDef: FormSectionDef): ObservableFormSectionDef  {
        return new ObservableFormSectionDef(sectionDef);
    }

    private createDefaultSection(): ObservableFormSectionDef {
        return this.buildObservableSectionDef({ blocks: [], icons: [], nameTemplate: null });
    }

    public createDefaultTextQuestionBlock(): QuestionBlockDef<TextQuestionDef> & Identifiable {
        return {
            blockType: 'QUESTION',
            question: this.createDefaultTextQuestion(),
            id: this.generateIdentifier()
        };
    }

    public createDefaultPicklistQuestionBlock(): QuestionBlockDef<PicklistQuestionDef> & Identifiable {
        return {
            blockType: 'QUESTION',
            question: this.createDefaultPicklistQuestion(),
            id: this.generateIdentifier()
        };
    }

    public createDefaultContentBlock(): ContentBlockDef & Identifiable {
        return {
            blockType: 'CONTENT',
            titleTemplate: null,
            bodyTemplate: this.createBlankTemplate(),
            id: this.generateIdentifier()
        };
    }

    private createDefaultBaseQuestion(): AbstractQuestionDef {
        return {
            stableId: '',
            isRestricted: false,
            isDeprecated: false,
            promptTemplate: this.createBlankTemplate(),
            validations: [],
            hideNumber: false,
            questionType: 'TEXT'
        };
    }

    private createDefaultTextQuestion(): TextQuestionDef {
        return {
            ...this.createDefaultBaseQuestion(),
            questionType: 'TEXT',
            inputType: 'TEXT',
            suggestionType: 'NONE',
            placeholderTemplate: this.createBlankTemplate(),
            suggestions: []
        };
    }

    private createDefaultPicklistQuestion(): PicklistQuestionDef {
        return {
            ...this.createDefaultBaseQuestion(),
            questionType: 'PICKLIST',
            selectMode: 'SINGLE',
            renderMode: 'LIST',
            picklistLabelTemplate: this.createBlankTemplate(),
            groups: [],
            picklistOptions: [],
        };
    }

    public createBlankTemplate(): Template {
        return {
            templateType: 'HTML',
            templateText: '$__template__',
            variables: [
                {
                    name: '__template__',
                    translations: [
                        {
                            language: 'en',
                            text: ''
                        }
                    ]
                }
            ]
        };
    }

    private generateIdentifier(): string {
        return ++StudyConfigObjectFactory.idCounter + '';
    }
}
