import {Page} from "@playwright/test";
import OncHistoryTable from "../tables/onc-history-table";


export default class OncHistoryTab {
  private readonly oncHistoryTable = new OncHistoryTable(this.page);

  constructor(private readonly page: Page) {
  }

  public get table(): OncHistoryTable {
    return this.oncHistoryTable;
  }
}
