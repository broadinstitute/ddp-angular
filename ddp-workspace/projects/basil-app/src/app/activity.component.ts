import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html',
    styles: [
        `.example-fill-remaining-space {
        flex: 1 1 auto;
      }`
    ]
})
export class ActivityComponent implements OnInit {
    public id: string;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router) { }

    public ngOnInit(): void {
        // get param
        this.id = this.activatedRoute.snapshot.queryParams['id'];
    }

    public navigate(url: string): void {
        this.router.navigateByUrl(url);
    }
}
