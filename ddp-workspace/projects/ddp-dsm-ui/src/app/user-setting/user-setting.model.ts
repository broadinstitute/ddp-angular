import { Utils } from '../utils/utils';
import * as _ from 'underscore';

export class UserSetting {
  constructor(public rowsOnPage: number, public rowSet0: number, public rowSet1: number, public rowSet2: number,
              public favViews: any, public dateFormat: string, public defaultTissueFilter: string,
              public defaultParticipantFilter: string
  ) {
    this.setToDefaultValues();

    // if value is not 0 fill with actual value from user settings table
    if (rowsOnPage !== 0 && _.isNumber(rowsOnPage)) {
      this.rowsOnPage = rowsOnPage;
    }
    if (rowSet0 !== 0 && _.isNumber(rowSet0)) {
      this.rowSet0 = rowSet0;
    }
    if (rowSet1 !== 0 && _.isNumber(rowSet1)) {
      this.rowSet1 = rowSet1;
    }
    if (rowSet2 !== 0 && _.isNumber(rowSet2)) {
      this.rowSet2 = rowSet2;
    }
    if (!_.isNull(dateFormat) && !_.isUndefined(dateFormat)) {
      this.dateFormat = dateFormat;
    }
    this.defaultParticipantFilter = defaultParticipantFilter;
    this.defaultTissueFilter = defaultTissueFilter;
  }

  private defaultRowsOnPage = 10;
  private defaultRowsSet0 = 10;
  private defaultRowsSet1 = 25;
  private defaultRowsSet2 = 50;
  private defaultDateFormat: string = Utils.DATE_STRING_IN_CVS;

  static parse(json): UserSetting {
    return new UserSetting(json.rowsOnPage, json.rowSet0, json.rowSet1, json.rowSet2,
      json.favViews, json._dateFormat, json.defaultTissueFilter, json.defaultParticipantFilter);
  }


  private setToDefaultValues(): void {
    this.rowsOnPage = this.defaultRowsOnPage;
    this.rowSet0 = this.defaultRowsSet0;
    this.rowSet1 = this.defaultRowsSet1;
    this.rowSet2 = this.defaultRowsSet2;
    this.dateFormat = this.defaultDateFormat;
  }

  public getRowsPerPage(): number {
    return this.rowsOnPage;
  }

  public getRowSet0(): number {
    return this.rowSet0;
  }

  public getRowSet1(): number {
    return this.rowSet1;
  }

  public getRowSet2(): number {
    return this.rowSet2;
  }

  public getDateFormat(): string {
    return this.dateFormat;
  }

  public set setRowsPerPage(rowsOnPage: number) {
    this.rowsOnPage = rowsOnPage;
  }
}
