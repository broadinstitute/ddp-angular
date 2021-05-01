import { Template } from '../core/template';
import { TemplateType } from '../core/templateType';
import { TemplateVariable } from '../core/templateVariable';
import { Translation } from '../core/translation';
import { LanguageCode } from '../core/languageCode';

export class SimpleTemplate implements Template {
    templateCode: string = null;
    templateText: string;
    templateType: TemplateType;
    variables: Array<TemplateVariable>;

    constructor(template: Template) {
        this.templateCode = template.templateCode;
        this.templateText = template.templateText;
        this.templateType = template.templateType;
        this.variables = [template.variables[0]];
    }

    setTranslationText(languageCode: LanguageCode, text: string): void {
        let translation = this.getTranslation(languageCode);
        if (!translation) {
            translation = {language: languageCode, text: ''};
            this.variables[0].translations.push(translation);
        }
        translation.text = text;
    }
    getTranslationText(languageCode: LanguageCode): string | undefined {
        return this.getTranslation(languageCode)?.text;
    }

    private getTranslation(languageCode: LanguageCode): Translation | undefined {
        return this.variables[0].translations.find(trans => trans.language === languageCode);
    }

    toTemplate(): Template {
        return {templateCode: this.templateCode, templateText: this.templateText,
            templateType: this.templateType, variables: this.variables} as Template;
    }
}
