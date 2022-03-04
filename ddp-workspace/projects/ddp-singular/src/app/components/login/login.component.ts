import { Component} from "@angular/core";
import {Auth0AdapterService} from "ddp-sdk";

@Component({
    selector: 'app-login',
    template: ''
})
export class LoginComponent {
    constructor(private auth0: Auth0AdapterService) {
        this.auth0.login()
    }
}
