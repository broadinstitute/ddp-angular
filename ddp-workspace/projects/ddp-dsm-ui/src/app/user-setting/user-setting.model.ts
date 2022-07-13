import {Utils} from '../utils/utils';

export class UserSetting {
  rowSet0 = 10;
  rowSet1 = 25;
  rowSet2 = 50;
  dateFormat = Utils.DATE_STRING_IN_CVS;

  constructor( public rowsPerPage = 10,
               public defaultTissueFilter: string,
               public defaultParticipantFilter: string
  ) {
    // if value is not 0 fill with actual value from user settings table
    if (rowsPerPage && rowsPerPage !== 0) {
      this.rowsPerPage = rowsPerPage;
    }
  }

  static parse( json ): UserSetting {
    return new UserSetting( json.rowsOnPage, json.defaultTissueFilter, json.defaultParticipantFilter );
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

