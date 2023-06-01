import { AdditionalFilter } from 'dsm/component/filters/sections/search/search-enums';

type Today = 'today';
type AdditionalFilters = AdditionalFilter[];

export interface DateConfig {
  from: string | Date | Today | null | undefined;
  to: string | Date | Today | null | undefined;
  additionalFilters: AdditionalFilters | null | undefined;
}

export interface TextConfig {
  textValue: string | null | undefined;
  additionalFilters: AdditionalFilters;
  exactMatch: boolean;
}

export interface CheckboxConfig {
  checkboxValues: string[] | null | undefined;
  additionalFilters: AdditionalFilters;
}

export interface RadioButtonConfig {
  radioButtonValue: string | null | undefined;
  additionalFilters: AdditionalFilters;
}
