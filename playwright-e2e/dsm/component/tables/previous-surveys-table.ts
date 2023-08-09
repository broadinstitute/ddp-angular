import { Page } from '@playwright/test';
import Table from 'dss/component/table';

export default class PreviousSurveysTable extends Table {
  constructor(page: Page) {
    super(page, { cssClassAttribute: '.table' });
  }
}
