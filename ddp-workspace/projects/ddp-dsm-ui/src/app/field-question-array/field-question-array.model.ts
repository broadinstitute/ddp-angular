import { Question } from '../field-question/field-question.model';

export class Questions {
  constructor(public done: boolean, public questions: Question[]) {
    this.done = done;
    this.questions = questions;
  }

  static parse(json): Questions {
    const _json = JSON.parse(json);
    return new Questions(_json.done, _json.questions);
  }
}
