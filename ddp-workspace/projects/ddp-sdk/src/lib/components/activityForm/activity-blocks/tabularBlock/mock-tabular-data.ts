import { ActivityBooleanQuestionBlock } from '../../../../models/activity/activityBooleanQuestionBlock';
import { BooleanRenderMode } from '../../../../models/activity/booleanRenderMode';
import { ActivityCompositeQuestionBlock, ActivityDateQuestionBlock, ActivityTextQuestionBlock, QuestionType } from 'ddp-sdk';
import { ActivityTabularBlock } from '../../../../models/activity/activityTabularBlock';
import { BlockType } from '../../../../models/activity/blockType';
import { of } from 'rxjs';

// Mock data for tabular block unit-tests

const booleanQuestion: unknown = {
    trueContent: 'Yes',
    falseContent: 'No',
    renderMode: BooleanRenderMode.CHECKBOX,
    questionType: QuestionType.Boolean,
    stableId: 'CONSENT_BLOOD',
    question: 'Boolean question title',
    tooltip: null,
    readonly: false,
    additionalInfoHeader: null,
    additionalInfoFooter: null,
    answer: null,
    validators: [],
    serverValidationMessages: [],
    serverValidationMessages$: of([]),
    shown: true,
    enabled: true,
    columnSpan: 1
};

const textQuestion1: unknown = {
    placeholder: 'First Name',
    confirmEntry: false,
    questionType: QuestionType.Text,
    stableId: 'CONSENT_SIGNATURE',
    question: 'First Name',
    readonly: false,
    answer: 'John',
    validators: [],
    serverValidationMessages: [],
    serverValidationMessages$: of([]),
    shown: true,
    enabled: true,
    columnSpan: 1
};

const textQuestion2: unknown = {
    placeholder: 'Last Name',
    confirmEntry: false,
    questionType: QuestionType.Text,
    stableId: 'CONSENT_SIGNATURE_1',
    question: 'Last Name',
    readonly: false,
    answer: 'Doe',
    validations: [],
    serverValidationMessages: [],
    serverValidationMessages$: of([]),
    shown: true,
    enabled: true,
    columnSpan: 1
};

const textQuestion3: unknown = {
    placeholder: 'YYYY',
    confirmEntry: false,
    questionType: QuestionType.Text,
    stableId: 'CONSENT_SIGNATURE',
    question: 'Year',
    readonly: false,
    answer: [],
    validators: [],
    serverValidationMessages: [],
    serverValidationMessages$: of([]),
    shown: true,
    enabled: true,
    columnSpan: 1
};

const dateQuestion: unknown = {
    renderMode: 'TEXT',
    displayCalendar: false,
    fields: [ 'MONTH', 'DAY', 'YEAR'],
    placeholder: null,
    questionType: QuestionType.Date,
    stableId: 'CONSENT_DOB',
    question: 'Date of Birth',
    tooltip: null,
    readonly: false,
    additionalInfoHeader: null,
    additionalInfoFooter: null,
    answer: [],
    validators: [],
    serverValidationMessages: [],
    serverValidationMessages$: of([]),
    shown: true,
    enabled: true,
    columnSpan: 1
};

const numericQuestion: unknown = {
    placeholder: 'Age',
    questionType: QuestionType.Numeric,
    stableId: 'AGE',
    question: 'How old are you?',
    tooltip: null,
    readonly: false,
    additionalInfoHeader: null,
    additionalInfoFooter: null,
    answer: [],
    serverValidationMessages: [],
    serverValidationMessages$: of([]),
    shown: true,
    enabled: true,
    validators: [],
    columnSpan: 1
};

const compositeQuestion: unknown = {
    allowMultiple: false,
    addButtonText: '+ Add another location',
    additionalItemText: null,
    children: [
        textQuestion3,
        numericQuestion
    ],
    childOrientation: 'VERTICAL',
    questionType: QuestionType.Composite,
    stableId: 'EVER_LOC_LIST',
    question: 'Ascites requiring paracentesis',
    tooltip: null,
    readonly: false,
    additionalInfoHeader: null,
    additionalInfoFooter: null,
    answer: [],
    validators: [],
    serverValidationMessages: [],
    serverValidationMessages$: of([]),
    shown: true,
    enabled: true,
    columnSpan: 3, // 1 for question text, 2 for the child questions
    tabularSeparator: 'Or'
};

export const mockTabularData2: Partial<ActivityTabularBlock> = {
    columnsCount: 4,
    title: 'Tabular block with Composite',
    headers: [
        {
            label: 'Type',
            columnSpan: 2
        },
        {
            label: 'First onset or event',
            columnSpan: 2
        }
    ],
    content: [
        booleanQuestion as ActivityBooleanQuestionBlock,
        compositeQuestion as ActivityCompositeQuestionBlock,
        booleanQuestion as ActivityBooleanQuestionBlock,
        compositeQuestion as ActivityCompositeQuestionBlock,
        booleanQuestion as ActivityBooleanQuestionBlock,
        compositeQuestion as ActivityCompositeQuestionBlock,
        booleanQuestion as ActivityBooleanQuestionBlock,
        compositeQuestion as ActivityCompositeQuestionBlock,
        booleanQuestion as ActivityBooleanQuestionBlock,
        compositeQuestion as ActivityCompositeQuestionBlock,
    ],
    blockType: BlockType.Tabular,
    id: 'TABULAR_ID_2',
    shown: true,
    enabled: true
};

export const mockTabularData1: Partial<ActivityTabularBlock> = {
    columnsCount: 2,
    title: 'Simple Tabular block',
    headers: [
        {
            label: 'Question',
            columnSpan: 1
        },
        {
            label: 'Answer',
            columnSpan: 1
        }
    ],
    content: [
        textQuestion1 as ActivityTextQuestionBlock,
        textQuestion2 as ActivityTextQuestionBlock,
        dateQuestion as ActivityDateQuestionBlock
    ],
    blockType: BlockType.Tabular,
    id: 'TABULAR_ID_1',
    shown: true,
    enabled: true
};
