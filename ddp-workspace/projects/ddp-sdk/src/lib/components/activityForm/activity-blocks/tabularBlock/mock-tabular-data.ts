import {
    booleanQuestion,
    dateQuestion,
    numericQuestion,
    specialBbooleanQuestion,
    textQuestion1,
    textQuestion2,
    textQuestion3
} from './mock-questions';


const compositeQuestion = {
    allowMultiple: false,
    addButtonText: '+ Add another location',
    additionalItemText: null,
    children: [
        textQuestion3,
        numericQuestion,
        // specialBooleanQuestion
    ],
    childOrientation: 'VERTICAL',
    questionType: 'COMPOSITE',
    stableId: 'EVER_LOC_LIST',
    prompt: 'Ascites requiring paracentesis',
    textPrompt: 'Ascites requiring paracentesis',
    tooltip: null,
    readonly: false,
    additionalInfoHeader: null,
    additionalInfoFooter: null,
    answers: [],
    validations: [],
    validationFailures: null,
    shown: true,
    enabled: true,

    tabularSeparator: 'Or' // new field !
};


export const mockTabularData2 = {
    numberOfColumns: 4,
    title: 'Tabular block with Composite',
    headers: [
        {
            label: 'Type',
            startColumn: 1,
            endColumn: 3
        },
        {
            label: 'First onset or event',
            startColumn: 3,
            endColumn: 5
        }
    ],

    content: [
        [booleanQuestion, compositeQuestion],
        [booleanQuestion, compositeQuestion],
        [booleanQuestion, compositeQuestion],
        [booleanQuestion, compositeQuestion],
        [booleanQuestion, compositeQuestion]
    ],

    displayNumber: null,
    blockType: 'TABULAR',
    blockGuid: 'TABULAR_ID_2',
    shown: true,
    enabled: true
};


export const mockTabularData1 = {
    numberOfColumns: 2,
    title: 'Simple Tabular block',
    headers: [
        {
            label: 'Question',
            startColumn: 1,
            endColumn: 2
        },
        {
            label: 'Answer',
            startColumn: 2,
            endColumn: 3
        }
    ],

    content: [
        [textQuestion1],
        [textQuestion2],
        [dateQuestion]
    ],

    displayNumber: null,
    blockType: 'TABULAR',
    blockGuid: 'TABULAR_ID_1',
    shown: true,
    enabled: true
};
