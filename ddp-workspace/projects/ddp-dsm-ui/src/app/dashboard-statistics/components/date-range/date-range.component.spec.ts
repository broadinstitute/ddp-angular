import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {DateRangeComponent} from "./date-range.component";
import {ComponentHarness, HarnessLoader, HarnessQuery} from "@angular/cdk/testing";
import {DatePipe} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {TestbedHarnessEnvironment} from "@angular/cdk/testing/testbed";
import {expect} from "@angular/flex-layout/_private-utils/testing";
import {DateRangeModel} from "../../models/DateRange.model";
import {MatDateRangeInputHarness, MatEndDateHarness, MatStartDateHarness} from "@angular/material/datepicker/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {ReactiveFormsModule} from "@angular/forms";
import {DebugElement} from "@angular/core";
import {DateErrorPipe} from "../../pipes/date-error.pipe";
import {MatFormFieldHarness} from "@angular/material/form-field/testing";

describe("dateRangeComponent", () => {
  type startOrEnd = "start" | "end";

  let fixture: ComponentFixture<DateRangeComponent>;
  let component: DateRangeComponent;
  let componentDebugElement: DebugElement;
  let harnessLoader: HarnessLoader;

  const datePipe: DatePipe = new DatePipe('en-US');
  const testData: DateRangeModel = {startDate: new Date(0), endDate: new Date()};
  const DATE_FORMAT_TRANSFORMED: string = 'M/d/YYYY';

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
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeComponent);
    component = fixture.debugElement.componentInstance;
    harnessLoader = TestbedHarnessEnvironment.loader(fixture);
    componentDebugElement = fixture.debugElement;

    setTestData();
  })

  it("should create component", () => {
    expect(component).toBeTruthy();
  })

  it("should have start date", async () => {
    const matStartDateValue: string = await matDateValue("start");

    expect(matStartDateValue).toBe(transformDateFormat(matStartDateValue))
  })

  it("should have end date", async () => {
    const matEndDateValue: string = await matDateValue("end");

    expect(matEndDateValue).toBe(transformDateFormat(matEndDateValue))
  })

  it("should have set date - start date", async() => {
    const startDate: string = new Date(1994, 10, 10).toString();
    await setDateValue("start", startDate);

    const matStartDateValue = await matDateValue("start");

    expect(matStartDateValue).toBe(transformDateFormat(startDate));
  })

  it("should show error message after setting it manually - required start date", async () => {
    await setDateValue("start", null);
    const [startDateRequired]: string[] = await getErrorMessages();

    expect(startDateRequired).toBe('Start date is required');
  })

  it("should show error message after setting it manually - required end date", async () => {
    await setDateValue("end", null);
    const [endDateRequired]: string[] = await getErrorMessages();

    expect(endDateRequired).toBe('End date is required');
  })

  it("should show error message after setting it manually - invalid start date", async () => {
    await setDateValue("start", "3123");
    const [startDateInvalid]: string[] = await getErrorMessages();

    expect(startDateInvalid).toBe('Start date is invalid');
  })

  it("should show error message after setting it manually - invalid end date", async () => {
    await setDateValue("end", "123");
    const [endDateInvalid]: string[] = await getErrorMessages();

    expect(endDateInvalid).toBe('End date is invalid');
  })




  /* HELPER FUNCTIONS */
  const setTestData = (dateRangeObject?: DateRangeModel): void => {
    component.activeDates = dateRangeObject || testData;
    fixture.detectChanges();
  };

  /**
   * @type T should specify the type of the material component harness, which you want to query
   * @param matHarnessComponent should specify which material component harness you want to query
   * @return material harness component that you have specified as a type and parameter
   */
  const getMatHarness = async <T extends ComponentHarness>(matHarnessComponent: HarnessQuery<T>): Promise<T> =>
    await harnessLoader.getHarness<T>(matHarnessComponent);

  /**
   * @return matFormFieldHarness component
   */
  const getMatFormFieldHarness = async (): Promise<MatFormFieldHarness> => {
    return await getMatHarness<MatFormFieldHarness>(MatFormFieldHarness);
  }

  /**
   * @return matDateRangeInput component
   */
  const getMatDateRangeInputHarness = async (): Promise<MatDateRangeInputHarness> => {
    return await getMatHarness<MatDateRangeInputHarness>(MatDateRangeInputHarness);
  }

  /**
   * @param dateType type - what will be returned depends on the parameter which
   * is restricted to only two strings: "start" and "end"
   * @return either matStartDateHarness or matEndDateHarness component
   */
  const matDateInput = async (dateType: startOrEnd): Promise<MatStartDateHarness | MatEndDateHarness> =>  {
    const matDateRangeInputHarness: MatDateRangeInputHarness =
      await getMatDateRangeInputHarness();

    return dateType === "start" ?
      await matDateRangeInputHarness.getStartInput() : await matDateRangeInputHarness.getEndInput();
  }

  /**
   * @param dateType type - what will be returned depends on the parameter which
   * is restricted to only two strings: "start" and "end"
   * @return returns value from either matStartDateHarness or from matEndDateHarness
   */
  const matDateValue = async (dateType: startOrEnd): Promise<string> => {
    const matDateHarness: MatStartDateHarness | MatEndDateHarness = await matDateInput(dateType);

    return transformDateFormat(await matDateHarness.getValue());
  }

  /**
   * @return error messages array, which is extracted from matFormField's matErrors
   */
  const getErrorMessages = async (): Promise<string[]> => {
    const matFormFieldHarness: MatFormFieldHarness = await getMatFormFieldHarness();
    return  await matFormFieldHarness.getTextErrors()
  }

  /**
   * @param dateType type - it should be either "start" or "end", which will be concatenated
   * with "Date" string and in the end gives us the form field which we are aiming to reset
   * @param dateValue - this value will be set as in matInput also in FormControl
   */
  const setDateValue = async (dateType: startOrEnd, dateValue: string): Promise<void> => {
    component.dateRangeForm.get(`${dateType}Date`).patchValue(dateValue);
    component.dateRangeForm.markAllAsTouched();

    const dateInput = await matDateInput(dateType);
    await dateInput.setValue(dateValue);
  }

  /**
   * @param dateValue
   * used to transform date into specified date format
   */
  const transformDateFormat = (dateValue: string): string => {
    return datePipe.transform(dateValue, DATE_FORMAT_TRANSFORMED)
  }

})


