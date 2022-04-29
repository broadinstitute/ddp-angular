import {Utils} from '../utils/utils';

export class UserSetting {
  rowSet0: number;
  rowSet1: number;
  rowSet2: number;
  dateFormat: string;

  constructor( public rowsPerPage: number, public defaultTissueFilter: string,
               public defaultParticipantFilter: string
  ) {
    this.setToDefaultValues();

    // if value is not 0 fill with actual value from user settings table
    if (rowsPerPage && rowsPerPage !== 0) {
      this.rowsPerPage = rowsPerPage;
    }

    this.defaultParticipantFilter = defaultParticipantFilter;
    this.defaultTissueFilter = defaultTissueFilter;
  }

  private defaultRowsOnPage = 10;
  private defaultRowsSet0 = 10;
  private defaultRowsSet1 = 25;
  private defaultRowsSet2 = 50;
  private defaultDateFormat: string = Utils.DATE_STRING_IN_CVS;

  static parse( json ): UserSetting {
    return new UserSetting( json.rowsOnPage, json.defaultTissueFilter, json.defaultParticipantFilter );
  }


  private setToDefaultValues(): void {
    this.rowsPerPage = this.defaultRowsOnPage;
    this.rowSet0 = this.defaultRowsSet0;
    this.rowSet1 = this.defaultRowsSet1;
    this.rowSet2 = this.defaultRowsSet2;
    this.dateFormat = this.defaultDateFormat;
  }

  public getRowsPerPage(): number {
    return this.rowsPerPage;
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


}
