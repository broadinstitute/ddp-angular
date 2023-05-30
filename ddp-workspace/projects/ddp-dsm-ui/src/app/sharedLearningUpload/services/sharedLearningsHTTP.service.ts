import {Injectable} from "@angular/core";
import {delay,Observable, of} from "rxjs";
import {SharedLearningsFile} from "../interfaces/sharedLearningsFile";

@Injectable()
export class SharedLearningsHTTPService {
  /**
   * @TODO integrate backend
   */
  public get tempFiles(): Observable<SharedLearningsFile[]> {
    return of([]).pipe(delay(3000));
  }

  public uploadFile(file: File): Observable<any> {
    return of(null).pipe(delay(3000))
  }

}
