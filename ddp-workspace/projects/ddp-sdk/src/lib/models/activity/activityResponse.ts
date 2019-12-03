export class ActivityResponse {
    constructor(
        public next: string,
        public activityCode?: string,
        public instanceGuid?: string,
        public allowUnauthenticated?: boolean
    ) { }
}
