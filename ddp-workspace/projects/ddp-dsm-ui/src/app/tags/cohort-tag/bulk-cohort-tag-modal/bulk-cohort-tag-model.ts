import { ViewFilter } from "../../../filter-column/models/view-filter.model";

export class BulkCohortTag {

    constructor(
        public cohortTags: string[], 
        public manualFilter: string, 
        public savedFilter: ViewFilter, 
        public selectedPatients: string[],
        public selectedOption: string
    ) {}

}