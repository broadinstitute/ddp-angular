export interface OptionModel {
  optionStableId: string;
  optionText: string;
  nestedOptionText: string;
  nestedOptions: OptionModel[];
}
