import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {DateRangeComponent} from './date-range.component';
import {DatePipe} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {expect} from '@angular/flex-layout/_private-utils/testing';
import {DateRangeModel} from '../../models/DateRange.model';
import {MatDateRangeInputHarness, MatEndDateHarness, MatStartDateHarness} from '@angular/material/datepicker/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {DebugElement} from '@angular/core';
import {DateErrorPipe} from '../../pipes/date-error.pipe';
import {MatFormFieldHarness} from '@angular/material/form-field/testing';
import {MaterialHarnesses} from '../../../test-helpers/MaterialHarnesses';

describe('dateRangeComponent', () => {
  type startOrEnd = 'start' | 'end';

  let fixture: ComponentFixture<DateRangeComponent>;
  let component: DateRangeComponent;
  let componentDebugElement: DebugElement;
  let materialHarnessLoader: MaterialHarnesses;

  const datePipe: DatePipe = new DatePipe('en-US');
  const testData: DateRangeModel = {startDate: new Date(0), endDate: new Date()};
  const DATE_FORMAT_TRANSFORMED = 'M/d/YYYY';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DateRangeComponent, DateErrorPipe],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule
      ],
      providers: [DatePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeComponent);
    component = fixture.debugElement.componentInstance;
    materialHarnessLoader = new MaterialHarnesses(TestbedHarnessEnvironment.loader(fixture));
    componentDebugElement = fixture.debugElement;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('When initial data is passed', () => {
    beforeEach(() => {
      setInitialTestData();
    });

    it('should have start date', async () => {
      expect(await matDateValue('start')).toBe(transformDateFormat(new Date(0)));
    });

    it('should have end date', async () => {
      expect(await matDateValue('end')).toBe(transformDateFormat(new Date()));
    });
  });


  describe('When initial data is not passed', () => {
    it('should not have start date', async () => {
      expect(await matDateValue('start')).toBeNull();
    });

    it('should not have end date', async () => {
      expect(await matDateValue('end')).toBeNull();
    });

    it('should be enabled - start date', async () => {
      expect(await isDisabled('start')).toBeFalse();
    });

    it('should be enabled - end date', async () => {
      expect(await isDisabled('end')).toBeFalse();
    });
  });

  describe('Manually changing date ranges', () => {
    beforeEach(() => {
      setInitialTestData();
    });

    it('should have set date - start date', async () => {
      const date: Date = new Date(1994, 10, 10);

      expect(await matDateValueAfterSettingIt('start', date))
        .toBe(transformDateFormat(date));
    });

    it('should have set date - end date', async () => {
      const date: Date = new Date();

      expect(await matDateValueAfterSettingIt('end', date))
        .toBe(transformDateFormat(date));
    });

    it('should be disabled - start date', async () => {
      expect(await isDisabled('start', true)).toBeTrue();
    });

    it('should be disabled - end date', async () => {
      expect(await isDisabled('end', true)).toBeTrue();
    });

    it('should be enabled -  start date', async () => {
      expect(await isDisabled('start', false)).toBeFalse();
    });

    it('should be enabled -  end date', async () => {
      expect(await isDisabled('end', false)).toBeFalse();
    });

    it('should show error message - required start date', async () => {
      expect(await errorMessageAfterSettingValue('start', null)).toBe('Start date is required');
    });

    it('should show error message - required end date', async () => {
      expect(await errorMessageAfterSettingValue('end', null)).toBe('End date is required');
    });

    it('should show error message - invalid start date', async () => {
      expect(await errorMessageAfterSettingValue('start', '3123')).toBe('Start date is invalid');
    });

    it('should show error message - invalid end date', async () => {
      expect(await errorMessageAfterSettingValue('end', '123')).toBe('End date is invalid');
    });
  });




  /* HELPER FUNCTIONS */
  const setInitialTestData = (): void => {
    component.activeDatesOnInit = testData;
    component.disabledState = false;
    fixture.detectChanges();
  };

  /**
   * @param dateValue
   * used to transform date into specified date format
   */
  const transformDateFormat = (dateValue: string | Date): string => datePipe.transform(dateValue, DATE_FORMAT_TRANSFORMED);

  /**
   *
   @return simplified version of getting particular field's disabled state - either true of false
   */
  const isDisabled = async (dateType: startOrEnd, disabled?: boolean): Promise<boolean> => {
    disabled !== undefined && setDisabledState(disabled);
    const matDateHarness: MatStartDateHarness | MatEndDateHarness = await matDateInput(dateType);

    return await matDateHarness.isDisabled();
  };

  /**
   * @param disabled
   * sets state of input fields
   */
  const setDisabledState = (disabled: boolean): void => {
    component.disabledState = disabled;
    fixture.detectChanges();
  };

  /**
   * @param dateType type - what will be returned depends on the parameter which
   * is restricted to only two strings: "start" and "end"
   * @return either matStartDateHarness or matEndDateHarness component
   */
  const matDateInput = async (dateType: startOrEnd): Promise<MatStartDateHarness | MatEndDateHarness> =>  {
    const matDateRangeInputHarness: MatDateRangeInputHarness =
      await materialHarnessLoader.getMatDateRangeInputHarness();

    return dateType === 'start' ?
      await matDateRangeInputHarness.getStartInput() : await matDateRangeInputHarness.getEndInput();
  };


  /**
   *
   * @return simplified version of getting date field value after resetting it
   */
  const matDateValueAfterSettingIt = async (dateType: startOrEnd, value: Date | string | null): Promise<string> => {
    await setDateValue(dateType, value);
    return await matDateValue(dateType);
  };

  /**
   * @param dateType type - what will be returned depends on the parameter which
   * is restricted to only two strings: "start" and "end"
   * @return returns value from either matStartDateHarness or from matEndDateHarness
   */
  const matDateValue = async (dateType: startOrEnd): Promise<string> => {
    const matDateHarness: MatStartDateHarness | MatEndDateHarness = await matDateInput(dateType);

    return transformDateFormat(await matDateHarness.getValue());
  };

  /**
   * @return error messages array, which is extracted from matFormField's matErrors
   */
  const getErrorMessages = async (): Promise<string[]> => {
    const matFormFieldHarness: MatFormFieldHarness = await materialHarnessLoader.getMatFormFieldHarness();
    return  await matFormFieldHarness.getTextErrors();
  };

  /**
   * @return array of error messages strings,
   */
  const errorMessageAfterSettingValue = async (dateType: startOrEnd, value: string | null): Promise<string> => {
    await setDateValue(dateType, value);
    const [firstErrorMessage]: string[] = await getErrorMessages();
    return firstErrorMessage;
  };

  /**
   * @param dateType type - it should be either "start" or "end", which will be concatenated
   * with "Date" string and in the end gives us the form field which we are aiming to reset
   * @param dateValue - this value will be set as in matInput also in FormControl
   */
  const setDateValue = async (dateType: startOrEnd, dateValue: Date | string): Promise<void> => {
    component.dateRangeForm.get(`${dateType}Date`).patchValue(dateValue);
    component.dateRangeForm.get(`${dateType}Date`).markAsTouched();

    const dateInput = await matDateInput(dateType);
    await dateInput.setValue(dateValue?.toString());
  };

});


