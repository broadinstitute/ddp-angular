import { Filter } from '../filter-column.model';

export class ViewFilter {
  selected = false;

  constructor(public filters: Filter[], public filterName: string, public columns: {}, public shared: boolean,
               public deleted: string, public userId: string, public id: string, public parent: string, public icon: string,
               public quickFilterName: string, public queryItems: string) {
    this.filters = filters;
    this.filterName = filterName;
    this.columns = columns;
    this.deleted = deleted;
    this.shared = shared;
    this.userId = userId;
    this.id = id;
    this.parent = parent;
    this.quickFilterName = quickFilterName;
    this.queryItems = queryItems;
  }

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
          const filteredColumn = currentFilter.find(filter => {
            return filter.participantColumn.name === f.participantColumn.name && filter.participantColumn.tableAlias === key;
          });
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
    const f: Filter[] = [];
    for (const filter of this.filters) {
      f.push(filter.copy());
    }
    const c = {};
    for (const key of Object.keys(this.columns)) {
      c[ key ] = [];
      for (const column of this.columns[ key ]) {
        c[ key ].push(column.copy());
      }
    }
    const v = new ViewFilter(
      f, Object.assign('', this.filterName), c,
      // TODO: check is it correct ? - new Boolean() ?
      // eslint-disable-next-line
      Object.assign(new Boolean(), this.shared), Object.assign(new Boolean(), this.deleted),
      Object.assign('', this.userId), Object.assign('', this.id), Object.assign('', this.parent),
      Object.assign('', this.icon), Object.assign('', this.quickFilterName),
      Object.assign('', this.queryItems)
    );
    return v;
  }
}
