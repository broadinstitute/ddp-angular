import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

import { CompositeDisposable } from 'ddp-sdk';

interface Term {
  Title: string;
  SkipCount?: boolean;
  Paragraphs: (string | ComplexParagraph)[];
}

interface ComplexParagraph {
  Title: string;
  Content: string;
}

interface TemplateTerm extends Term {
  Count: number;
}

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent implements OnInit, OnDestroy {
  terms: TemplateTerm[];
  private anchor = new CompositeDisposable();
  private readonly LIST_TRANSLATION_KEY = 'Pages.TermsAndConditions.List';

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.setupListI18nListener();
  }

  ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  isComplexParagraph(paragraph: string | ComplexParagraph): boolean {
    return typeof paragraph !== 'string';
  }

  private setupListI18nListener(): void {
    const sub = this.translateService
      .get(this.LIST_TRANSLATION_KEY)
      .pipe(
        map<Term[], TemplateTerm[]>(translations => {
          const transformedTerms: TemplateTerm[] = [];
          let count = 1;

          translations.forEach(translation => {
            transformedTerms.push({
              ...translation,
              Count: count,
            });

            if (!translation.SkipCount) {
              count++;
            }
          });

          return transformedTerms;
        }),
      )
      .subscribe(transformedTerms => {
        this.terms = transformedTerms;
      });

    this.anchor.addNew(sub);
  }
}
