import {AbstractionFieldModel} from './abstractionField.model';
import {AbstractionField} from '../../../medical-record-abstraction/model/medical-record-abstraction-field.model';

export interface QCWrapperModel {
  abstraction: AbstractionFieldModel;
  review: AbstractionField;
  equals: boolean;
  check: boolean;
}
