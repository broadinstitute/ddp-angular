import {NoDataPipe} from "./noData.pipe";
import {expect} from "@angular/flex-layout/_private-utils/testing";

fdescribe("noData Pipe", () => {
  const pipe = new NoDataPipe();

  const nonBrakingSpace = (): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = '&nbsp;'
    return tempDiv.innerText;
  };

  /*
    Checking if in case of particular type of values, it returns exactly the same value (In string format)
   */
  it("Should return value", () => {
    const diffData = [5, "ddp", "5", 0, true];
    diffData.forEach(value => expect(pipe.transform(value)).toEqual(String(value)))
  })

  /*
    Checking if in case of falsy value, it returns non-braking space, in order to display
    empty space properly in HTML
   */
  it("Should return empty space", () => {
    const falsyValues = ["", false, undefined, null];
    falsyValues.forEach(value => expect(pipe.transform(value)).toEqual(nonBrakingSpace()));
  })

})
