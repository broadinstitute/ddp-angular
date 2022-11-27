import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {ErrorsService} from "../services/errors.service";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private errorsService: ErrorsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        this.errorsService.openSnackbar(httpErrorResponse);
        throw httpErrorResponse;
      })
    )
  }
}
