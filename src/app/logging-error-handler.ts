import {DDPErrorHandler} from "./ddp-error-handler";
import {Response} from "@angular/http";
export class LoggingErrorHandler implements DDPErrorHandler {

  handleErrors(res:Response) {
    console.log('Handling errors with response status ' + res.status);
    return !res.ok;
  }

  handleReAuth() {
    console.log('handling re-auth');
  }

  handleMaintenance() {
    console.log('handling maintenance outage');
  }

  handleGenericError(err:any) {
    console.log('handling error ' + JSON.stringify(err));
  }
}
