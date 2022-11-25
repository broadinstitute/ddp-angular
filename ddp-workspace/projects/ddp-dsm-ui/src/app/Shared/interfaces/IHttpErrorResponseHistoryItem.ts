import {HttpErrorResponse} from "@angular/common/http";

export interface IHttpErrorResponseHistoryItem {
  httpErrorResponse: HttpErrorResponse,
  timeStamp: Date;
}
