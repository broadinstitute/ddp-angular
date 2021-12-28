import { ActivityBlock } from './activityBlock';
import { BlockType } from './blockType';
import { QuestionType } from './questionType';
import { ActivityAbstractValidationRule } from '../../services/activity/validators/activityAbstractValidationRule';
import { BehaviorSubject, Observable } from 'rxjs';

export abstract class AbstractActivityQuestionBlock extends ActivityBlock {
  public answerId: string | null;
  // todo these 2 properties can probably go back to being type string
  // after placeholder property is added to API
  public question: string | null;
  public additionalInfoHeader: string | null;
  public additionalInfoFooter: string | null;
  public label: string | null = null;
  public placeholder: string | null;
  public stableId: string;
  public displayNumber: number | null;
  public tooltip: string | null;
  public readonly: boolean | false;
  public serverValidationMessages$: Observable<Array<string>>;
  public validators: Array<ActivityAbstractValidationRule> = [];
  private serverValidationMessagesSubject: BehaviorSubject<Array<string>> = new BehaviorSubject([]);

  constructor() {
    super();
    this.serverValidationMessages$ = this.serverValidationMessagesSubject.asObservable();
  }

  public get blockType(): BlockType {
    return BlockType.Question;
  }

  get blocks(): Array<ActivityBlock> {
    return [this];
  }

  public abstract get questionType(): QuestionType;

  public canPatch(): boolean {
    return this.enabled && this.validators
      .filter(validator => !validator.allowSave)
      .reduce((accumulator, validator) => accumulator && validator.recalculate(), true);
  }

  protected validateInternally(): boolean {
    let result = true;
    if (this.shown) {
      result = !this.serverValidationMessages || this.serverValidationMessages.length === 0;
      for (const validator of this.validators) {
        result = result && validator.recalculate();
      }
    }
    return result;
  }

  public set serverValidationMessages(messages: Array<string>) {
    this.serverValidationMessagesSubject.next(messages);
  }

  public get serverValidationMessages(): Array<string> {
    return this.serverValidationMessagesSubject.getValue();
  }

  public addServerValidationMessage(message: string): void {
    this.serverValidationMessagesSubject.next(this.serverValidationMessagesSubject.getValue().concat(message));
  }
}
