import {InputField} from "./input-field";
import {Observable} from "rxjs";

export interface Scanners {
  [scannerName: string]: {
    title: string;
    buttonValue: string;
    saveFn: (data: object) => Observable<any>;
    inputFields: InputField[]
  }
}
