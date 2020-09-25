import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivityPicklistQuestionBlock } from 'ddp-sdk';
import { QuestionComponent } from './questionComponent';
import { PicklistParameters } from '../../model/picklistParameters';

@Component({
    selector: 'app-sandbox-picklist-question',
    templateUrl: 'picklistQuestion.component.html'
})
export class PicklistQuestionComponent extends QuestionComponent<ActivityPicklistQuestionBlock> implements OnInit {
    public rerender = false;

    constructor(private cdRef: ChangeDetectorRef) {
        super();
        const parameters: PicklistParameters = {
            readonly: false,
            shown: true,
            detailMaxLength: 255,
            picklistLabel: '',
            options: [
                {
                    stableId: 'AAA',
                    optionLabel: 'I have not recived any medications',
                    allowDetails: true,
                    detailLabel: 'Why?',
                    exclusive: true,
                    groupId: null,
                    tooltip: null
                }
            ],
            groups: [
                {
                    name: 'Category 01',
                    options: [
                        {
                            stableId: 'BBB',
                            optionLabel: 'letrozole (Femara)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_1',
                            tooltip: null
                        },
                        {
                            stableId: 'CCC',
                            optionLabel: 'exemestane (Aromasin) + everolimus (Afinitor)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_1',
                            tooltip: null
                        },
                        {
                            stableId: 'DDD',
                            optionLabel: 'pertuzumab (Perjeta) + trastuzumab (Herceptin) + docetaxel (Taxotere)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_1',
                            tooltip: null
                        },
                        {
                            stableId: 'EEE',
                            optionLabel: 'trastuzumab (Herceptin)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_1',
                            tooltip: null
                        },
                        {
                            stableId: 'FFF',
                            optionLabel: 'trastuzumab (Herceptin) + paclitaxel (Taxol)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_1',
                            tooltip: null
                        },
                        {
                            stableId: 'HHH',
                            optionLabel: 'trastuzumab (Herceptin) + docetaxel (Taxotere)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_1',
                            tooltip: null
                        },
                        {
                            stableId: 'III',
                            optionLabel: 'trastuzumab (Herceptin) + vinorelbine (Navelbine)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_1',
                            tooltip: null
                        },
                        {
                            stableId: 'KKK',
                            optionLabel: 'trastuzumab (Herceptin) + capecitabine (Xeloda)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_1',
                            tooltip: null
                        },
                        {
                            stableId: 'LLL',
                            optionLabel: 'lapatinib (Tykerb) + capecitabine (Xeloda)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_1',
                            tooltip: null
                        },
                        {
                            stableId: 'MMM',
                            optionLabel: 'trastuzumab (Herceptin) + lapatinib (Tykerb)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_1',
                            tooltip: null
                        },
                        {
                            stableId: 'NNN',
                            optionLabel: 'ado-trastuzumab emtansine (T-DM1) (Kadcyla)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_1',
                            tooltip: null
                        }
                    ]
                },
                {
                    name: 'Category 02',
                    options: [
                        {
                            stableId: 'OOO',
                            optionLabel: 'doxorubicin (adriamycin)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_2',
                            tooltip: null
                        },
                        {
                            stableId: 'PPP',
                            optionLabel: 'pegylated liposomal doxorubicin (Doxil, LipoDox)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_2',
                            tooltip: null
                        },
                        {
                            stableId: 'QQQ',
                            optionLabel: 'paclitaxel (Taxol)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_2',
                            tooltip: null
                        },
                        {
                            stableId: 'RRR',
                            optionLabel: 'cyclophosphamide (Cytoxan, Neosar, Clafen, Revimmune)',
                            allowDetails: false,
                            detailLabel: null,
                            exclusive: false,
                            groupId: 'category_2',
                            tooltip: null
                        }
                    ]
                }
            ],
            renderMode: 'CHECKBOX_LIST',
            selectMode: 'MULTIPLE'
        };
        this.inputParameters = JSON.stringify(parameters, null, '\t');
        this.question = new ActivityPicklistQuestionBlock();
        this.apply(parameters);
    }

    public ngOnInit(): void {
        this.update();
    }

    public update(): void {
        try {
            const parameters: PicklistParameters = JSON.parse(this.inputParameters);
            this.apply(parameters);
            this.validationMessage = null;
            this.rerender = true;
            this.cdRef.detectChanges();
            this.rerender = false;
        } catch (error) {
            this.validationMessage = `invalid parameters: ${error}`;
        }
    }

    private apply(parameters: PicklistParameters): void {
        this.readonly = parameters.readonly;
        this.question.shown = parameters.shown;
        this.question.detailMaxLength = parameters.detailMaxLength;
        this.question.picklistOptions = parameters.options;
        this.question.renderMode = parameters.renderMode;
        this.question.selectMode = parameters.selectMode;
        this.question.picklistGroups = parameters.groups;
        this.question.picklistLabel = parameters.picklistLabel;
    }
}
