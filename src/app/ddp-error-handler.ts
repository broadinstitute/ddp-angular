import {Response} from "@angular/http";
export interface DDPErrorHandler {
  /**
   * Examines response and determines whether there is any
   * action to take.  Returns true if there were errors.
   */
  handleErrors(res:Response):boolean;

  /**
   * Called when the session has expired and the
   * user needs to login again
   */
  handleReAuth():void;

  /**
   * Called when the backend is down for
   * maintenance
   */
  handleMaintenance():void;

  /**
   * Called for a generic error
   */
  handleGenericError(err:any):void;

}
