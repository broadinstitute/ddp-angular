import { Injectable } from '@angular/core';
import { PrionActivityInstanceState } from '../models/prionActivityInstanceState';

@Injectable()
export class PrionActivityInstanceStatusService {
    constructor() {}

    public static getStatuses(): Array<PrionActivityInstanceState> {
        const statuses: Array<PrionActivityInstanceState> = [];
        statuses.push(new PrionActivityInstanceState('CREATED', 'Toolkit.Dashboard.States.Created'));
        statuses.push(new PrionActivityInstanceState('IN_PROGRESS', 'Toolkit.Dashboard.States.InProgress'));
        statuses.push(new PrionActivityInstanceState('COMPLETE', 'Toolkit.Dashboard.States.Completed'));
        return statuses;
    }
}
