import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CountsTableComponent} from './counts-table.component';
import {expect} from '@angular/flex-layout/_private-utils/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CountsModel} from '../../models/Counts.model';
import {ComponentHarness, HarnessLoader, HarnessQuery} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatInputHarness} from '@angular/material/input/testing';
import {MatSortHarness, MatSortHeaderHarness} from '@angular/material/sort/testing';
import {MatCellHarness, MatRowHarness, MatTableHarness} from '@angular/material/table/testing';

describe('CountsTableComponent',  () => {
  let fixture: ComponentFixture<CountsTableComponent>;
  let component: CountsTableComponent;
  let harnessLoader: HarnessLoader;
  const testData: CountsModel[] = [
    {
      color: [],
      count: 50,
      size: 'SMALL',
      title: 'PTs w/ Blood Consent',
      type: 'COUNT'
    },
    {
      color: [],
      count: 49,
      size: 'SMALL',
      title: 'PTs w/ Tissue Consent',
      type: 'COUNT'
    },
    {
      color: [],
      count: 1,
      size: 'SMALL',
      title: 'Mr Requested',
      type: 'COUNT'
    }
  ];


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CountsTableComponent],
      imports: [MatTableModule, MatSortModule, MatInputModule, MatFormFieldModule, NoopAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountsTableComponent);
    component = fixture.debugElement.componentInstance;
    harnessLoader = TestbedHarnessEnvironment.loader(fixture);

    setTestData();
  });

  /**
   * Only checks if component was created
   */
  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Checks if all data is visible by the number of rows rendered on UI
   */
  it('should show all data', async () => {
    const matTableHarness: MatTableHarness = await getMatHarness<MatTableHarness>(MatTableHarness);
    const matRowHarnesses: MatRowHarness[] = await matTableHarness.getRows();

    expect(matRowHarnesses.length).toBe(3);
  });

  /**
   * Checks if in case of no data, appropriate row is visible by count of rows (should be 1)
   * and by its first cell's context
   */
  it('should show zero data', async () => {
    component.setCounts = []; // Resetting data to an empty array

    const matTableHarness: MatTableHarness = await getMatHarness<MatTableHarness>(MatTableHarness);
    const matRowHarnesses: MatRowHarness[] = await matTableHarness.getRows();
    const [firstCell]: MatCellHarness[] = await matRowHarnesses[0].getCells();
    const firstCellText: string = await firstCell.getText();

    expect(matRowHarnesses.length).toBe(1);
    expect(firstCellText).toBe('No data matching the filter ""');
  });

  /**
   * Checks after filtering by "mr" title/count, if there is displayed only one row with appropriate context
   */
  it('should filter one item', async () => {
    const matRowHarnesses: MatRowHarness[] = await getTableRowsAfterFilter('mr');
    const [firstCell]: MatCellHarness[] = await matRowHarnesses[0].getCells();
    const firstCellText: string = await firstCell.getText();

    expect(matRowHarnesses.length).toBe(1);
    expect(firstCellText).toBe('Mr Requested');
  });

  /**
   * Checks after filtering by non-existing title/count, if there is displayed only one row with appropriate context
   */
  it('should filter zero item', async () => {
    const NOT_FOUND = 'notFound';
    const matRowHarnesses: MatRowHarness[] = await getTableRowsAfterFilter(NOT_FOUND);
    const [firstCell]: MatCellHarness[] = await matRowHarnesses[0].getCells();
    const firstCellText: string = await firstCell.getText();

    expect(firstCellText).toBe('No data matching the filter ' + '"' + NOT_FOUND + '"');
  });

  /**
   * Checks after sorting by ascending order the Count column, if rows are displayed in expected order
   */
  it('should sort by Count', async () => {
    const [firstRow]: MatRowHarness[] = await getTableRowsAfterAscendingSort('Count');
    const {title, count}: Partial<CountsModel> = await firstRow.getCellTextByColumnName();

    expect(count).toEqual('1');
    expect(title).toBe('Mr Requested');
  });

  /**
   * Checks after sorting by ascending order the Title column, if rows are displayed in expected order
   */
  it('should sort by Title', async () => {
    const [_,secondRow]: MatRowHarness[] = await getTableRowsAfterAscendingSort('Title');
    const {title, count}: Partial<CountsModel> = await secondRow.getCellTextByColumnName();

    expect(count).toEqual('50');
    expect(title).toBe('PTs w/ Blood Consent');
  });


  /* HELPER FUNCTIONS */

  /**
   * Sets test data and detects changes before each test case
   */
  const setTestData = (): void => {
    component.setCounts = testData;
    fixture.detectChanges();
  };

  /**
   * @type T should specify the type of the material component harness, which you want to query
   * @param component should specify which material component harness you want to query
   * @return material harness component that you have specified as a type and parameter
   */
  const getMatHarness = async <T extends ComponentHarness>(matHarnessComponent: HarnessQuery<T>): Promise<T> =>
    await harnessLoader.getHarness<T>(matHarnessComponent);

  /**
   * @param value: string
   * @return filtered table body's rows
   */
  const getTableRowsAfterFilter = async (value: string): Promise<MatRowHarness[]> => {
    const matInputField: MatInputHarness = await getMatHarness<MatInputHarness>(MatInputHarness);
    await matInputField.setValue(value);
    const matTableHarness: MatTableHarness = await getMatHarness<MatTableHarness>(MatTableHarness);

    return await matTableHarness.getRows();
  };

  /**
   * @param label the name of the column by which table can sort data
   * @return filtered table body's rows
   */
  const getTableRowsAfterAscendingSort = async (label: string): Promise<MatRowHarness[]> => {
    const matSortHarness: MatSortHarness = await getMatHarness<MatSortHarness>(MatSortHarness);
    const matTableHarness: MatTableHarness = await getMatHarness<MatTableHarness>(MatTableHarness);

    const [sortHeaderHarnesses]: MatSortHeaderHarness[] = await matSortHarness.getSortHeaders({label});
    await sortHeaderHarnesses.click();

    return await matTableHarness.getRows();
  };

});
