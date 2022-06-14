import { AbstractionFieldModel } from "./abstractionField.model";

export interface AbstractionGroupModel {
  abstractionGroupId: number;
  displayName: string;
  orderNumber: number;
  fields: AbstractionFieldModel[]
}
