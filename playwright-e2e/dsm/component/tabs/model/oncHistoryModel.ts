import { Locator } from '@playwright/test';
import { LocalControlEnum } from '../enums/oncHistory-enums/localControl-enum';
import { MethodOfDecalcificationEnum } from '../enums/oncHistory-enums/methodOfDecalcification-enum';
import { SampleFFPEEnum } from '../enums/oncHistory-enums/sampleFFPE-enum';
import { RequestStatusEnum } from '../enums/oncHistory-enums/request-enum';

export default class OncHistory {
    constructor(
        public request: Locator,
        public dateOfPX: string = '',
        public typeOfPX: string = '',
        public locationOfPX: string = '',
        public histology: string = '',
        public accessionNumber: string = '',
        public facility: string = '',
        public phone: string = '',
        public fax: string = '',
        public destructionYears: string = '',
        public sampleIsFromLocalControl: LocalControlEnum,
        public methodOfDecalcification: MethodOfDecalcificationEnum,
        public sampleIsFFPE: SampleFFPEEnum,
        public tissueNotes: Locator,
        public requestStatus: RequestStatusEnum
    ) {}
}
