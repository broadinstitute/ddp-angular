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

    public createDefaultContentBlock(): ContentBlockDef & Identifiable {
        return {
            blockType: 'CONTENT',
            titleTemplate: null,
            bodyTemplate: this.createBlankTemplate(),
            id: this.generateIdentifier()
        };
    }

    private createDefaultTextQuestion(): TextQuestionDef {
        return {
            questionType: 'TEXT',
            stableId: '',
            isRestricted: false,
            isDeprecated: false,
            promptTemplate: this.createBlankTemplate(),
            validations: [],
            hideNumber: false,
            inputType: 'TEXT',
            suggestionType: 'NONE',
            placeholderTemplate: this.createBlankTemplate(),
            suggestions: []
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
