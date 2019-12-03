import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Observer } from 'rxjs';

export interface ScriptModel {
  name: string;
  src: string;
}

@Injectable()
export class ScriptLoaderService {
  private scripts: ScriptModel[] = [];

  constructor(@Inject(DOCUMENT) private document: any) { }

  public load(script: ScriptModel): Observable<ScriptModel> {
    return new Observable<ScriptModel>((observer: Observer<ScriptModel>) => {
      const existingScript = this.scripts.find(s => s.name === script.name);

      // Complete if already loaded
      if (existingScript && existingScript['loaded']) {
        observer.next(existingScript);
        observer.complete();
      } else {
        // Load the script
        const scriptElement = this.document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = script.src;

        scriptElement.onload = () => {
          this.scripts.push(script);
          script['loaded'] = true;
          observer.next(script);
          observer.complete();
        };

        scriptElement.onerror = (error: any) => {
          observer.error("Couldn't load script " + script.src);
        };

        this.document.getElementsByTagName('body')[0].appendChild(scriptElement);
      }
    });
  }
}
