import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-account-verification',
    template: `
 <toolkit-header></toolkit-header>
 <div class="Container Row"> 
    <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
        <h2 class="Title" translate>Toolkit.AccountVerification.Title</h2>
        <p>
            <span translate>Toolkit.AccountVerification.Description1</span>
            <span class="Accent">{{email}}</span>
            <span translate>Toolkit.AccountVerification.Description2</span>
            <span class="Accent" translate>Toolkit.AccountVerification.Description3</span>
            <span translate>Toolkit.AccountVerification.Description4</span>
        </p>
    </div>
</div>              
`
})
export class AccountVerificationComponent implements OnInit {
    email: string;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.route.queryParams.subscribe(
            // executed each time new params arrive
            params => {
                this.email = params['email'] || null;
            }
        );
    }

    ngOnInit() {
        window.scrollTo(0, 0);

        //TODO: TEMPORARY: for now, just have them log in and start the workflow rather than displaying this page for very long
        console.log('redirecting');
        this.router.navigateByUrl('start-study');
    }

}
