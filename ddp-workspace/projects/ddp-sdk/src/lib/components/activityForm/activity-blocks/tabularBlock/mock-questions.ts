export const picklistAutocomplete = {
    selectMode: 'SINGLE',
    renderMode: 'AUTOCOMPLETE',
    picklistLabel: null,
    groups: [],
    picklistOptions: [
        {
            stableId: 'ABDOMEN',
            optionLabel: 'Abdomen / Abdominal Cavity',
            tooltip: null,
            detailLabel: null,
            allowDetails: false,
            exclusive: false,
            groupId: null,
            nestedOptionsLabel: null,
            nestedOptions: []
        },
        {
            stableId: 'ADIPOSE_TISSUE',
            optionLabel: 'Adipose Tissue / Fat',
            tooltip: null,
            detailLabel: null,
            allowDetails: false,
            exclusive: false,
            groupId: null,
            nestedOptionsLabel: null,
            nestedOptions: []
        },
        {
            stableId: 'ADRENAL_GLAND',
            optionLabel: 'Adrenal Gland(s)',
            tooltip: null,
            detailLabel: null,
            allowDetails: false,
            exclusive: false,
            groupId: null,
            nestedOptionsLabel: null,
            nestedOptions: []
        },
        {
            stableId: 'OTHER',
            optionLabel: 'Unsure how to answer',
            tooltip: null,
            detailLabel: 'Please provide details',
            allowDetails: true,
            exclusive: false,
            groupId: null,
            nestedOptionsLabel: null,
            nestedOptions: []
        },
        {
            stableId: 'UNSURE',
            optionLabel: 'Unsure how to answer',
            tooltip: null,
            detailLabel: null,
            allowDetails: false,
            exclusive: false,
            groupId: null,
            nestedOptionsLabel: null,
            nestedOptions: []
        }
    ],
    questionType: 'PICKLIST',
    stableId: 'EVER_BODY_LOC',
    prompt: '',
    textPrompt: '',
    tooltip: null,
    readonly: false,
    additionalInfoHeader: null,
    additionalInfoFooter: null,
    answers: [],
    validations: [],
    validationFailures: null
};

export const booleanQuestion = {
    trueContent: 'Yes',
    falseContent: 'No',
    questionType: 'BOOLEAN',
    stableId: 'CONSENT_BLOOD',
    prompt: null, //'Boolean question title',
    textPrompt: 'Boolean question title',
    tooltip: null,
    readonly: false,
    additionalInfoHeader: null,
    additionalInfoFooter: null,
    answers: [],
    validations: [
        {
            rule: 'REQUIRED',
            message: 'Please choose yes or no',
            allowSave: false
        }
    ],
    validationFailures: null,
    shown: true,
    enabled: true
};

export const specialBbooleanQuestion = {
    trueContent: 'Yes',
    // falseContent: 'No',
    questionType: 'BOOLEAN',
    stableId: 'SPECIAL_STABLE_ID',
    prompt: null, //'Boolean question title',
    textPrompt: 'Boolean question title',
    tooltip: null,
    readonly: false,
    additionalInfoHeader: null,
    additionalInfoFooter: null,
    answers: [],
    validations: [],
    validationFailures: null,
    shown: true,
    enabled: true
};

export const textQuestion1 = {
    inputType: 'SIGNATURE',
    suggestionType: 'NONE',
    placeholderText: 'First Name',
    confirmEntry: false,
    questionType: 'TEXT',
    stableId: 'CONSENT_SIGNATURE',
    prompt: 'First Name',
    textPrompt: 'First Name',
    readonly: false,
    answers: [],
    validations: [
        {
            rule: 'REQUIRED',
            message: 'First Name is required',
            allowSave: false
        }
    ],
    shown: true,
    enabled: true
};

export const textQuestion2 = {
    inputType: 'SIGNATURE',
    suggestionType: 'NONE',
    placeholderText: 'Last Name',
    confirmEntry: false,
    questionType: 'TEXT',
    stableId: 'CONSENT_SIGNATURE_1',
    prompt: 'Last Name',
    textPrompt: 'Last Name',
    readonly: false,
    answers: [],
    validations: [
        {
            rule: 'REQUIRED',
            message: 'Last Name is required',
            allowSave: false
        }
    ],
    shown: true,
    enabled: true
};

export const textQuestion3 = {
    inputType: 'SIGNATURE',
    suggestionType: 'NONE',
    placeholderText: 'YYYY',
    confirmEntry: false,
    questionType: 'TEXT',
    stableId: 'CONSENT_SIGNATURE',
    prompt: 'Year',
    textPrompt: 'Year',
    readonly: false,
    answers: [],
    validations: [],
    shown: true,
    enabled: true
};


export const dateQuestion = {
    renderMode: 'TEXT',
    displayCalendar: false,
    fields: [ 'MONTH', 'DAY', 'YEAR'],
    placeholderText: null,
    questionType: 'DATE',
    stableId: 'CONSENT_DOB',
    prompt: 'Date of Birth',
    textPrompt: 'Date of Birth',
    tooltip: null,
    readonly: false,
    additionalInfoHeader: null,
    additionalInfoFooter: null,
    answers: [],
    validations: [
        {
            rule: 'REQUIRED',
            message: 'Please enter date of birth in MM DD YYYY format',
            allowSave: false
        },
        {
            startDate: '1898-01-01',
            endDate: '2022-05-08',
            rule: 'DATE_RANGE',
            message: 'Please enter date of birth in MM DD YYYY format',
            allowSave: false
        }
    ],
    validationFailures: null,
    shown: true,
    enabled: true
};

export const picklistQuestion = {
    selectMode: 'SINGLE',
    renderMode: 'LIST',
    picklistLabel: null,
    groups: [],
    picklistOptions: [
        {
            stableId: 'PARTICIPANT',
            optionLabel: 'I want to join as a participant',
            tooltip: null,
            detailLabel: null,
            allowDetails: false,
            exclusive: false,
            groupId: null,
            nestedOptionsLabel: null,
            nestedOptions: []
        },
        {
            stableId: 'MAILING_LIST',
            optionLabel: 'I want to join the mailing list',
            tooltip: null,
            detailLabel: null,
            allowDetails: false,
            exclusive: false,
            groupId: null,
            nestedOptionsLabel: null,
            nestedOptions: []
        }
    ],
    questionType: 'PICKLIST',
    stableId: 'PREQUAL_JOIN',
    prompt: 'How do you want to join the study?',
    textPrompt: 'How do you want to join the study?',
    tooltip: null,
    readonly: false,
    additionalInfoHeader: null,
    additionalInfoFooter: null,
    answers: [],
    validations: [
        {
            rule: 'REQUIRED',
            message: 'Please choose an option above',
            allowSave: false
        }
    ],
    validationFailures: null
};

export const numericQuestion = {
    placeholderText: 'Age',
    questionType: 'NUMERIC',
    stableId: 'AGE',
    prompt: 'How old are you?',
    textPrompt: '',
    tooltip: null,
    readonly: false,
    additionalInfoHeader: null,
    additionalInfoFooter: null,
    answers: [],
    shown: true,
    enabled: true,
    validations: [
        {
            rule: 'REQUIRED',
            message: 'Please enter an age between 0 and 110',
            allowSave: true
        },
        {
            min: 0,
            max: 110,
            rule: 'INT_RANGE',
            message: 'Please enter an age between 0 and 110',
            allowSave: false
        }
    ],
    validationFailures: null
};
