export class BulkCohortTag {

    constructor(
        public cohortTags: string[], 
        public manualFilter: string, 
        public savedFilter: any, 
        public selectedPatients: string[],
        public selectedOption: string
    ) {}

}