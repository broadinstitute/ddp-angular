import {Response} from "@angular/http";
import {DDPErrorHandler} from "./ddp-error-handler";
export abstract class GenericErrorHandler implements DDPErrorHandler {

  abstract handleErrors(res:Response):boolean;

  /**
   * Called when the session has expired and the
   * user needs to login again
   */
  abstract handleReAuth():void;

  /**
   * Called when the backend is down for
   * maintenance
   */
  abstract handleMaintenance():void;

  /**
   * Called for a generic error
   */
  abstract handleGenericError(err:any):void;
}
