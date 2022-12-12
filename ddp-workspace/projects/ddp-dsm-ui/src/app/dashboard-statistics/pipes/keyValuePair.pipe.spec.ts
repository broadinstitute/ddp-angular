import {KeyValuePairPipe} from './KeyValuePair.pipe';
import {expect} from '@angular/flex-layout/_private-utils/testing';

describe('keyValuePair Pipe', () => {
  const pipe = new KeyValuePairPipe();
  const initialObject = {
    foo: 'bar',
  };

  it('Should return key-value objects array', () => {
    expect(pipe.transform(initialObject)).toEqual([{key: 'foo', value: 'bar'}]);
  });
});
