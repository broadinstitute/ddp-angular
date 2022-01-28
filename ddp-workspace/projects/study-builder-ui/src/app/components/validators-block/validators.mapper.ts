import { RuleDef } from '../../model/core/ruleDef';
import { RuleType } from '../../model/core/ruleType';

export type ValidationControlsData = Record<RuleType, {
    [key: string]: any;
}>;

export class ValidatorsMapper {

    /* returns rules like:
    * [
    *      { ruleType: 'REQUIRED', message: 'This field is required!' },
    *      { ruleType: 'LENGTH', minLength: 2, maxLength: 10, message: 'Wrong length' }
    * ]
    */
    static mapToValidationRules(validatorsData: ValidationControlsData): RuleDef[] {
        return Object.keys(validatorsData).reduce((acc, validatorName) => {
            const {on, ...rest} = validatorsData[validatorName];
            if (on) {
                const notEmptyProperties = Object.keys(rest).reduce((accum, currentKey) => {
                    accum[currentKey] = rest[currentKey] || undefined;
                    return accum;
                }, {});
                const rule = {ruleType: validatorName, ...notEmptyProperties};
                acc.push(rule);
            }
            return acc;
        }, []);
    }


    /* returns validator controls data like:
    * {
        "REQUIRED": { "on": true, "message": "This field is required!" },
        "LENGTH": { "on": true, "minLength": 2, "maxLength": "10", "message": "Wrong length" }
    * }
    */
    static mapToValidationControlsData(rules: RuleDef[] = []): ValidationControlsData {
        return rules.reduce((acc, currentRule: RuleDef) => {
            const {ruleType, ...otherProperties} = currentRule;
            acc[ruleType as RuleType] = {...otherProperties, on: true};
            return acc;
        }, {}) as ValidationControlsData;
    }
}
