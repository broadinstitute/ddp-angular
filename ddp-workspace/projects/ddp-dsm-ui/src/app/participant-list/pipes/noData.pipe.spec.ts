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
    Checking if in case of truthy value, it returns exactly the same value (In string format)
   */
  it("should return value", () => {
    const diffData = [5, "ddp", "5", true];
    diffData.forEach(value => expect(pipe.transform(value)).toEqual(value.toString()))
  })

  /*
    Checking if in case of falsy value, it returns non-braking space, in order to display
    empty space properly in HTML
   */
  it("should return empty space", () => {
    const falsyValues = ["", false, 0, undefined, null];
    falsyValues.forEach(value => expect(pipe.transform(value).toString()).toEqual(nonBrakingSpace()));
  })

})
