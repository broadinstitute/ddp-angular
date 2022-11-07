import {ComponentHarness, HarnessLoader, HarnessQuery} from '@angular/cdk/testing';
import {MatFormFieldHarness} from '@angular/material/form-field/testing';
import {MatDateRangeInputHarness} from '@angular/material/datepicker/testing';

/**
 * @CLASS Used for testing common Angular Material Components
 */
export class MaterialHarnesses {

  constructor(private harnessLoader: HarnessLoader) {
  }

  /**
   * @type T should specify the type of the material component harness, which you want to query
   * @param matHarnessComponent should specify which material component harness you want to query
   * @return material harness component that you have specified as a type and parameter
   */
  public readonly getMatHarness = async <T extends ComponentHarness>(matHarnessComponent: HarnessQuery<T>): Promise<T> =>
    await this.harnessLoader.getHarness<T>(matHarnessComponent);

  /**
   * @return matFormFieldHarness component
   */
  public readonly getMatFormFieldHarness = async (): Promise<MatFormFieldHarness> =>
    await this.getMatHarness<MatFormFieldHarness>(MatFormFieldHarness);

  /**
   * @return matDateRangeInput component
   */
  public readonly getMatDateRangeInputHarness = async (): Promise<MatDateRangeInputHarness> =>
    await this.getMatHarness<MatDateRangeInputHarness>(MatDateRangeInputHarness);
}
