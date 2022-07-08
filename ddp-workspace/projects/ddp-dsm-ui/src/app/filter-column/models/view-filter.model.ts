import {Filter} from '../filter-column.model';

export class ViewFilter {
  selected = false;

  constructor(public filters: Filter[], public filterName: string, public columns: {}, public shared: boolean,
               public deleted: string, public userId: string, public id: string, public parent: string, public icon: string,
               public quickFilterName: string, public queryItems: string) {}

  public static parseFilter(json, allColumns: {}): ViewFilter {
    const columns = json.columns;
    let currentFilter = null;
    let parsedColumns: {} = Filter.parseToColumnArray(columns, allColumns);
    if (json.userId !== 'System' && json.filters !== undefined) {
      currentFilter = Filter.parseToCurrentFilterArray(json, allColumns, parsedColumns);
      const p = {};
      for (const key of Object.keys(parsedColumns)) {
        const tmp = new Array<Filter>();
        for (const f of parsedColumns[ key ]) {
          const filteredColumn = currentFilter.find(filter =>
            filter.participantColumn.name === f.participantColumn.name &&
            filter.participantColumn.tableAlias === key
          );
          if (filteredColumn === undefined) {
            tmp.push(f);
          } else {
            tmp.push(filteredColumn);
          }
        }
        if (key === 'o' || key === 'ex' || key === 'r') {
          p[ 'p' ] = tmp;
        } else if (key === 'inst') {
          p[ 'm' ] = tmp;
        } else {
          p[ key ] = tmp;
        }
      }
      parsedColumns = p;
    }
    return new ViewFilter(currentFilter, json.filterName, parsedColumns, json.shared, json.fDeleted, json.userId, json.id,
      json.parent, json.icon, json.quickFilterName, json.queryItems);
  }

  public copy(): ViewFilter {
    const filtersProp: Filter[] = [];
    if (this.filters?.length) {
      for (const filter of this.filters) {
        filtersProp.push(filter.copy());
      }
    }
    const columnsProp = {};
    for (const key of Object.keys(this.columns)) {
      columnsProp[ key ] = [];
      for (const column of this.columns[ key ]) {
        columnsProp[ key ].push(column.copy());
      }
    }
    const copiedProps: ViewFilter = Object.assign({}, this);

    return new ViewFilter(
      filtersProp || [],
      copiedProps.filterName,
      columnsProp,
      copiedProps.shared,
      copiedProps.deleted,
      copiedProps.userId,
      copiedProps.id,
      copiedProps.parent,
      copiedProps.icon,
      copiedProps.quickFilterName,
      copiedProps.queryItems
    );
  }
}
