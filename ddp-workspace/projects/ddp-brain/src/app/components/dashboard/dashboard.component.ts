import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-dashboard',
    template: `<toolkit-dashboard-redesigned [selectedUserGuid]="selectedUserGuid$ | async"></toolkit-dashboard-redesigned>`,
})
export class DashboardComponent {
    public selectedUserGuid$: Observable<string|null>;
    constructor(private route: ActivatedRoute) {
        this.selectedUserGuid$ = this.route.paramMap.pipe(map(params => params.get('userGuid')));
    }
}
