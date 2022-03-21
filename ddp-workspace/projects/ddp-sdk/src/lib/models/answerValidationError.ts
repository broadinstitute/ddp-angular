export interface AnswerValidationError {
    code: string;
    message: string;
    violations: Violation[];
}

interface  Violation {
    stableId: string;
    rules: Array<{ ruleType: string; message: string }>;
}
