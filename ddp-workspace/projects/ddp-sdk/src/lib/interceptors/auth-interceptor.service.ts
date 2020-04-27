import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth0AdapterService } from '../services/authentication/auth0Adapter.service';
import { SessionMementoService } from '../services/sessionMemento.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private session: SessionMementoService,
        private auth0: Auth0AdapterService) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.session.isSessionExpired()) {
            this.auth0.handleExpiredSession();
        } else {
            return next.handle(req);
        }
    }
}
