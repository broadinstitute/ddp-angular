import { AbstractionFieldValue } from './abstraction-field-value.model';

export class QCWrapper {
  constructor(public abstraction: AbstractionFieldValue, public review: AbstractionFieldValue,
              public equals: boolean, public check: boolean) {
  }

  static parse(json): QCWrapper {
    return new QCWrapper(json.abstraction, json.review, json.equals, json.check);
  }
}
