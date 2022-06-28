import {ValueModel} from './value.model';
import {AbstractionFieldValueModel} from './abstractionFieldValue.model';
import {QCWrapperModel} from './QCWrapper.model';

export interface AbstractionFieldModel {
  medicalRecordAbstractionFieldId: number;
  displayName: string;
  helpText: string;
  type: string;
  orderNumber: number;
  possibleValues: ValueModel[];
  additionalType: string;
  fieldValue: AbstractionFieldValueModel;
  qcWrapper: QCWrapperModel;
  fileInfo: boolean;
}
