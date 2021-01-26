import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs/index';

@Injectable()
export class TranslateStubService {
  public get<T>(key: T): Observable<T> {
    return of(key);
  }
}
