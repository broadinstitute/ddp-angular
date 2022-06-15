import {FiltersModel} from './filters.model';

export interface FilterModel {
  columns: { [index: string]: string[] };
  fDeleted: string;
  filterName: string;
  filters: FiltersModel[];
  id: string;
  parent: string;
  queryItems: string;
  shared: boolean;
  userId: string;
  icon?: string;
}
