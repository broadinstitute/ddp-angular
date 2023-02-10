import {InputField} from './input-field';
import {Observable} from 'rxjs';

export interface Scanners {
  [scannerName: string]: Scanner;
}

export interface Scanner {
  type: string;
  title: string;
  buttonValue: string;
  saveFn: (data: object) => Observable<any>;
  inputFields: InputField[];
}
